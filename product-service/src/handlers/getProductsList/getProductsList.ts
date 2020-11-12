import { APIGatewayProxyHandler } from 'aws-lambda';
import { defaultCors } from 'lib/constants/cors';
import { createConnection, closeConnection } from 'lib/db/connect';

export const getProductsList: APIGatewayProxyHandler = async () => {
  try {
    const client = await createConnection();

    const query = `
      SELECT p.id, p.title, p.description, p.price, s.count
        FROM products AS p
        JOIN stocks AS s ON p.id = s.product_id
    `;
    const products = (await client.query(query))?.rows;

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
  } finally {
    closeConnection();
  }
};
