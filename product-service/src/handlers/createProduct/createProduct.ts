import { APIGatewayProxyHandler } from 'aws-lambda';
import { defaultCors } from 'lib/constants/cors';
import { productSchema } from '../../models/Product';
import { createProduct as createProductDb } from '../../db/product';

export const createProduct: APIGatewayProxyHandler = async (event) => {
  try {
    const parsedBody = JSON.parse(event?.body ?? '{}');
    console.log('Body: ', parsedBody);

    const { title, description, price, count } = parsedBody;

    try {
      await productSchema.validateAsync({ title, description, price, count });
    } catch(err) {
      return {
        statusCode: 400,
        headers: defaultCors,
        body: err?.message,
      };
    }

    const result = await createProductDb([title, description, price, count]);

    return {
      statusCode: 200,
      headers: defaultCors,
      body: JSON.stringify(result, null, 2),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: defaultCors,
      body: 'Internal server error'
    };
  }
};
