import AWS from 'aws-sdk';
import { promisify } from 'util';
import { SQSHandler } from 'aws-lambda';
import { productSchema } from '../../models/Product';
import { createProduct } from '../../db/product';

export const catalogBatchProcess: SQSHandler = async (event) => {
  try {
    const snsSubject = "Import new products from catalogBatchProcess Lambda";
    const sns = new AWS.SNS({ region: process.env.AWS_REGION });
    const snsPublish = promisify(sns.publish).bind(sns);

    const tasks = event.Records.map(async ({ body }) => {
      const parsedBody = JSON.parse(body);
      const { title, description, price, count } = parsedBody;

      try {
        await productSchema.validateAsync({ title, description, price, count });

        try {
          const data = await createProduct([title, description, price, count]);

          const Message = `new product inserted: ${JSON.stringify(data)}`;
          await snsPublish({
            Subject: snsSubject,
            Message: Message,
            MessageAttributes: {
              status: {
                DataType: 'String',
                StringValue: 'Success'
              }
            },
            TopicArn: process.env.SNS_TOPIC_ARN,
          });
        } catch (e) {
          const Message = `Error occured during inserting data in DB: ${e.message}`;
          await snsPublish({
            Subject: snsSubject,
            Message,
            MessageAttributes: {
              status: {
                DataType: 'String',
                StringValue: 'Error'
              }
            },
            TopicArn: process.env.SNS_TOPIC_ARN,
          });
        }
      } catch (e) {
        const Message = `Product with the following data is not valid: ${body}`;
        await snsPublish({
          Subject: snsSubject,
          Message,
          MessageAttributes: {
            status: {
              DataType: 'String',
              StringValue: 'Error'
            }
          },
          TopicArn: process.env.SNS_TOPIC_ARN,
        });

        console.error(Message);
        return;
      }
    });

    // @ts-ignore
    await Promise.allSettled(tasks);
  } catch (e) {
    console.error(e);
  }
};
