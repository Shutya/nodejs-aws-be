import { APIGatewayProxyHandler } from 'aws-lambda';
import { defaultCors } from 'src/constants/cors';
import { createConnection, closeConnection } from 'src/utils/db/connect';
import { productSchema } from 'src/models/Product';

export const createProduct: APIGatewayProxyHandler = async (event) => {
  try {
    const client = await createConnection();
    const parsedBody = JSON.parse(event.body);

    console.log('Body: ', parsedBody);

    try {
      await productSchema.validateAsync(parsedBody);
    } catch(err) {
      return {
        statusCode: 400,
        headers: defaultCors,
        body: err?.message,
      };
    }

    const { title, description, price, count } = parsedBody;

    let result;

    try {
      await client.query('BEGIN');
      const query = `
        WITH insert_product AS (
          INSERT INTO products(title, description, price)
          VALUES ($1, $2, $3)
          RETURNING id, title, description, price
        ), insert_stock AS (
          INSERT INTO stocks(product_id, count)
          VALUES ( (SELECT id FROM insert_product), $4)
          RETURNING product_id, count
        )
        SELECT id, title, description, price, count
        FROM insert_product
        LEFT JOIN insert_stock ON product_id = insert_product.id
      `;
      result = (await client.query(query, [ title, description, price, count ]))?.rows?.[0];
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw new Error(e);
    }

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
  } finally {
    closeConnection();
  }
};
