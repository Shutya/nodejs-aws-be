import { importProductsFile } from './importProductsFile';
import AWS from 'aws-sdk-mock';

const url = 'http://some-url.com';

describe('importProductsFile ', () => {
  beforeAll(() => {
    AWS.mock("S3", "getSignedUrlPromise", Promise.resolve(url));
  });

  afterAll(() => {
    AWS.restore();
  });

  it('importProductsFile should return 400 status code with wrong name QP', async () => {
    // @ts-ignore
    expect((await importProductsFile({
      queryStringParameters: {
        name: 'file.json'
      }
    // @ts-ignore
    }))?.statusCode).toEqual(400);

    // @ts-ignore
    expect((await importProductsFile({
      queryStringParameters: {
        name: 'asd/file.csv'
      }
      // @ts-ignore
    }))?.statusCode).toEqual(400);

    // @ts-ignore
    expect((await importProductsFile({
      queryStringParameters: {}
      // @ts-ignore
    }))?.statusCode).toEqual(400);
  });

  it("importProductsFile should return 202 status code with valid data",
    async () => {
      // @ts-ignore
      const responseData = await importProductsFile({
        queryStringParameters: {
          name: 'file.csv'
        }
      });

      // @ts-ignore
      expect(responseData?.statusCode).toEqual(202);
      // @ts-ignore
      expect(await responseData.body.promise()).toEqual(url);
    });
});
