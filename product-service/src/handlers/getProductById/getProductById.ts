import { APIGatewayProxyHandler } from 'aws-lambda';
import { validate } from 'uuid';
import { defaultCors } from 'src/constants/cors';
import { createConnection, closeConnection } from 'src/utils/db/connect';

export const getProductById: APIGatewayProxyHandler = async (event) => {
  try {
    const client = await createConnection();

    const productId = event?.pathParameters?.productId;

    console.log('Product ID: ', productId);

    if (!validate(productId)) {
      return {
        statusCode: 400,
        headers: defaultCors,
        body: "Invalid input, uuid expected",
      };
    }

    const query = `
      SELECT p.id, p.title, p.description, p.price, s.count
        FROM products AS p
        JOIN stocks AS s ON p.id = s.product_id
        WHERE p.id = $1
    `;
    const product = (await client.query(query, [productId]))?.rows?.[0];

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
  } finally {
    closeConnection();
  }
};
