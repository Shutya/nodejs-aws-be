import { APIGatewayProxyHandler } from 'aws-lambda';
import { validate } from 'uuid';
import { defaultCors } from 'lib/constants/cors';
import { getProductById as getProductByIdDb } from '../../db/product';

export const getProductById: APIGatewayProxyHandler = async (event) => {
  try {
    const productId = event?.pathParameters?.productId;

    console.log('Product ID: ', productId);

    if (!validate(productId)) {
      return {
        statusCode: 400,
        headers: defaultCors,
        body: "Invalid input, uuid expected",
      };
    }
    const product = await getProductByIdDb(productId);

    if (!product) {
      return {
        statusCode: 404,
        headers: defaultCors,
        body: "Product with such id hasn't been found",
      };
    }

    return {
      statusCode: 200,
      headers: defaultCors,
      body: JSON.stringify(product, null, 2),
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
