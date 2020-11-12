import { getProductById } from './getProductById';
import { defaultCors } from 'lib/constants/cors';

const mockData = [
  { id: 'f48edfd3-adc4-4871-99c5-177a9eb2d0f3', title: 'title', description: 'description' },
  { id: 'f48edfd3-adc4-4871-99c5-177a9eb2d0f4', title: 'title', description: 'description' }
];

jest.mock('lib/db/connect', () => ({
  createConnection: async () => ({
    query: async (_query, data) => ({
      rows: [mockData.find(i => i.id === data[0])]
    })
  }),
  closeConnection: () => { }
}));

describe('getProductById ', () => {
  it('getProductById should return 400 status code with non integer parameters', async () => {
    const faultResponse = {
      statusCode: 400,
      headers: defaultCors,
      body: "Invalid input, uuid expected",
    };

    // @ts-ignore
    expect(await getProductById()).toEqual(faultResponse);
    // @ts-ignore
    expect(await getProductById({ pathParameters: { productId: 'asd' } })).toEqual(faultResponse);
  });

  it("getProductById should return 404 status code when product wasn't found", async () => {
    const notFoundResponse = {
      statusCode: 404,
      headers: defaultCors,
      body: "Product with such id hasn't been found",
    };

    // @ts-ignore
    expect(await getProductById(
      { pathParameters: { productId: 'f48edfd3-adc4-4871-99c5-177a9eb2d0f9' } })
    )
      .toEqual(notFoundResponse);
  });

  it("getProductById should return 200 status code and valid response if product was found",
    async () => {
      const correctResponse = {
        statusCode: 200,
        headers: defaultCors,
        body: JSON.stringify(mockData[0], null, 2),
      };

      // @ts-ignore
      expect(await getProductById({
        pathParameters: { productId: 'f48edfd3-adc4-4871-99c5-177a9eb2d0f3' } })
      )
        .toEqual(correctResponse);
    });
});