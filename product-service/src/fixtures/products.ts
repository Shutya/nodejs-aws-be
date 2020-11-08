export const createProductsFixtures = async (client): Promise<void> => {
  const createProductSql = `
    CREATE TABLE products (
      id uuid primary key default uuid_generate_v4(),
      title text not null,
      description text,
      price numeric
    );
  `;

  const createStockSql = `
    CREATE TABLE stocks (
      product_id uuid,
      count int,
      foreign key ("product_id") references "products" ("id")
    );
  `;

  const insertProductSql = `
    INSERT INTO products(title, description, price)
    VALUES
      ('Becks', 'The best beer ever', 1.4),
      ('Gambrinus', 'The best beer ever', 1.6),
      ('Tuborg', 'The best beer ever', 1.1),
      ('Krynitsa', 'The best beer ever', 0.6),
      ('Alivarka', 'The best beer ever', 0.7),
      ('Lidskoe', 'The best beer ever', 0.7),
      ('Rechica', 'The best beer ever', 0.7),
      ('Hineken', 'The best beer ever', 1.1),
      ('Stella arthois', 'The best beer ever', 1.1),
      ('Zhiguli', 'The best beer ever', 0.8)
  `;

  const insertStockSql = `
    INSERT INTO stocks
      (product_id, count)
    SELECT products.id, 10
    FROM products
  `;

  await client.query(createProductSql);
  await client.query(createStockSql);
  await client.query(insertProductSql);
  await client.query(insertStockSql);
};
