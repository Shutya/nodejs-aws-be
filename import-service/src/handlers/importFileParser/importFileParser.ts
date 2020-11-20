import AWS from 'aws-sdk';
import csv from 'csv-parser';
import { promisify } from 'util';

export const importFileParser = async (event) => {
  try {
    const s3 = new AWS.S3();
    const sqs = new AWS.SQS();
    const sqsSendMessagePromise = promisify(sqs.sendMessage).bind(sqs);

    console.log('Records:', event.Records);

    for (const record of event.Records) {
      const objectSource = record.s3.object.key;

      const stream = s3.getObject({
        Bucket: process.env.BUCKET_NAME,
        Key: objectSource
      }).createReadStream();

      await new Promise((resolve, reject) => {
        stream
          .pipe(csv())
          .on('data', async data => {
            try {
              await sqsSendMessagePromise({
                MessageBody: JSON.stringify(data),
                QueueUrl: process.env.QueueUrl
              });
            } catch (err) {
              console.error('Error occured during sending data to SQS: ', err);
              console.log('Tried to send data: ', data);
            }
          })
          .on('end', async () => {
            try {
              const fileName = objectSource.split('/').splice(-1)[0];

              await s3.copyObject({
                Bucket: process.env.BUCKET_NAME,
                CopySource: `${process.env.BUCKET_NAME}/${objectSource}`,
                Key: `parsed/${fileName}`
              }).promise();

              await s3.deleteObject({
                Bucket: process.env.BUCKET_NAME,
                Key: objectSource
              }).promise();

              resolve();
            } catch (e) {
              reject(e);
            }
          });
      });
    }
  } catch (err) {
    console.error(err);
  }
};
