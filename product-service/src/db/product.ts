import DB from "lib/db/connect";
import { Product } from '../@types/product';

export const getAllProducts = async (): Promise<Product[]> => {
  const db = new DB();
  const client = await db.connect();
  console.log(client);
  try {
    const query = `
      SELECT p.id, p.title, p.description, p.price, s.count
        FROM products AS p
        JOIN stocks AS s ON p.id = s.product_id
    `;
    const products = (await client.query(query))?.rows;
    return products;
  } catch (e) {
    throw new Error(e);
  } finally {
    db.disconnect();
  }
};

export const getProductById = async (productId: string): Promise<Product> => {
  const db = new DB();
  const client = await db.connect();

  try {
    const query = `
      SELECT p.id, p.title, p.description, p.price, s.count
        FROM products AS p
        JOIN stocks AS s ON p.id = s.product_id
        WHERE p.id = $1
    `;
    const product = (await client.query(query, [productId]))?.rows?.[0];
    return product;
  } catch (e) {
    throw new Error(e);
  } finally {
    db.disconnect();
  }
};

export const createProduct = async (data: string | number[]): Promise<Product> => {
  const db = new DB();
  const client = await db.connect();

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
    result = (await client.query(query, data))?.rows?.[0];
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw new Error(e);
  } finally {
    db.disconnect();
  }
};
