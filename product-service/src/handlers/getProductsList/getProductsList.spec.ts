import { getProductsList } from './getProductsList';
import { defaultCors } from 'src/constants/cors';
import products from 'src/data/products.json';

describe('getProductsList ', () => {
  it('getProductsList should return expected response', async () => {
    // @ts-ignore
    expect(await getProductsList()).toEqual({
      statusCode: 200,
      headers: defaultCors,
      body: JSON.stringify(products, null, 2),
    });
  });
});