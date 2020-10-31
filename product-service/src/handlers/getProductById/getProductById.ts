import { APIGatewayProxyHandler } from 'aws-lambda';
import products from 'src/data/products.json';
import { defaultCors } from 'src/constants/cors';

export const getProductById: APIGatewayProxyHandler = async (event) => {
  try {
    const productId = event?.pathParameters?.productId;

    if (!Number.isInteger(Number(productId))) {
      return {
        statusCode: 400,
        headers: defaultCors,
        body: "Invalid input, number expected",
      };
    }

    const product = products.find(({ id }) => id === productId);

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
    return {
      statusCode: 500,
      body: 'Internal server error'
    };
  }
};
