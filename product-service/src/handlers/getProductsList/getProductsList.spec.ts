import { getProductsList } from './getProductsList';
import { defaultCors } from 'src/constants/cors';
// import products from 'src/data/products.json';

const mockData = [
  { id: 1, title: 'title', description: 'description' },
  { id: 2, title: 'title', description: 'description' }
];

jest.mock('src/utils/db/connect', () => ({
  createConnection: async () => ({
    query: async () => ({
      rows: mockData
    })
  }),
  closeConnection: () => {}
}));

describe('getProductsList ', () => {
  it('getProductsList should return expected response', async () => {
    // @ts-ignore
    expect(await getProductsList()).toEqual({
      statusCode: 200,
      headers: defaultCors,
      body: JSON.stringify(mockData, null, 2),
    });
  });
});