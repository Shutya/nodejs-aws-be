import { APIGatewayProxyHandler } from 'aws-lambda';
import { defaultCors } from 'lib/constants/cors';
import { getAllProducts } from '../../db/product';

export const getProductsList: APIGatewayProxyHandler = async () => {
  try {
    const products = await getAllProducts();

    return {
      statusCode: 200,
      headers: defaultCors,
      body: JSON.stringify(products, null, 2),
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
