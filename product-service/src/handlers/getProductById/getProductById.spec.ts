import { getProductById } from './getProductById';
import { defaultCors } from 'src/constants/cors';
import products from 'src/data/products.json';

describe('getProductById ', () => {
  it('getProductById should return 400 status code with non integer parameters', async () => {
    const faultResponse = {
      statusCode: 400,
      headers: defaultCors,
      body: "Invalid input, number expected",
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
    expect(await getProductById({ pathParameters: { productId: '10000' } }))
      .toEqual(notFoundResponse);
  });

  it("getProductById should return 200 status code and valid response if product was found",
    async () => {
      const correctResponse = {
        statusCode: 200,
        headers: defaultCors,
        body: JSON.stringify(products[0], null, 2),
      };

      // @ts-ignore
      expect(await getProductById({ pathParameters: { productId: '1' } })).toEqual(correctResponse);
    });
});