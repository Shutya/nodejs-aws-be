import { getProductsList } from './getProductsList';
import { defaultCors } from 'lib/constants/cors';

const mockData = [
  { id: 1, title: 'title', description: 'description' },
  { id: 2, title: 'title', description: 'description' }
];

jest.mock('../../db/product', () => ({
  getAllProducts: async () => mockData
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