import { Pool, Client } from 'pg';

const pool = new Pool();

let client;

export const createConnection = async (): Promise<typeof Client> => {
  console.log('Starting initializing db connection');

  client = await pool.connect();

  console.log('Connected to Postgres DB');

  return client;
};

export const closeConnection = (): void => {
  console.log('Starting disconnection from db');

  client.release(true);

  console.log('Disconnected from Postgres DB');
};
