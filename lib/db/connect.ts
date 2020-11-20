import { Client } from 'pg';

const DB_CONFIG = {
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 7000,
};

interface DBInterface {
  client: typeof Client;
  connect: () => Promise<typeof Client>;
  disconnect: () => void;
}

export default class DB implements DBInterface {
  client = new Client(DB_CONFIG);

  async connect () {
    await this.client.connect();
    return this.client;
  }

  disconnect () {
    this.client.end();
  }
}
