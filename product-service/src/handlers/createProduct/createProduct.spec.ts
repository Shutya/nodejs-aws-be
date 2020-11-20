import { createProduct } from './createProduct';

const mockData = {
  id: 'f48edfd3-adc4-4871-99c5-177a9eb2d0f3',
  title: 'title',
  description: 'description',
  price: '10',
  count: 10
};


jest.mock('../../db/product', () => ({
  createProduct: async () => mockData
}));

describe('createProduct ', () => {
  it('createProduct should return 400 status code with wrong body', async () => {
    // @ts-ignore
    expect((await createProduct())?.statusCode).toEqual(400);
    // @ts-ignore
    expect((await createProduct(
      { body: JSON.stringify({ ...mockData, price: 'asd' }) }
      // @ts-ignore
    ))?.statusCode).toEqual(400);
  });

  it("createProduct should return 200 status code with valid data",
    async () => {
      // @ts-ignore
      expect((await createProduct({ body: JSON.stringify(mockData) }))?.statusCode).toEqual(200);
    });
});