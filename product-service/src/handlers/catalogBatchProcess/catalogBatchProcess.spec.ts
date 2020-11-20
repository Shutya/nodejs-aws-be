import AWS from 'aws-sdk-mock';
import { catalogBatchProcess } from './catalogBatchProcess';

const correctMockData = {
  id: 'f48edfd3-adc4-4871-99c5-177a9eb2d0f3',
  title: 'title',
  description: 'description',
  price: '10',
  count: 10
};

const incorrectMockData = {
  id: 'f48edfd3-adc4-4871-99c5-177a9eb2d0f3',
  description: 'description',
  price: '10',
  count: 'asd'
};

const validationMessage = 'Product with the following data is not valid:';
const successMessage = 'new product inserted:';

const mockFn = jest.fn();

jest.mock('../../db/product', () => ({
  createProduct: async () => correctMockData
}));

describe('catalogBatchProcess ', () => {
  beforeAll(() => {
    AWS.mock("SNS", "publish", (_params, callback) => {
      mockFn(_params?.Message);
      callback(null, 'Done');
    });
  });

  afterAll(() => {
    AWS.restore();
  });

  it('catalogBatchProcess should raise validation and return correct SNS topic', async () => {
    // @ts-ignore
    await catalogBatchProcess({ Records: [{ body: JSON.stringify(incorrectMockData) }] });
    // @ts-ignore
    expect(mockFn.mock.calls[mockFn.mock.calls.length - 1][0])
      .toContain(validationMessage);
  });

  it('catalogBatchProcess should creare product and return correct SNS topic if everything correct',
    async () => {
    // @ts-ignore
      await catalogBatchProcess({ Records: [{ body: JSON.stringify(correctMockData) }] });
      // @ts-ignore
      expect(mockFn.mock.calls[mockFn.mock.calls.length - 1][0]).toContain(successMessage);
    });

  it('catalogBatchProcess should work correctly with multiple input products',
    async () => {
      // @ts-ignore
      await catalogBatchProcess({ Records: [
        { body: JSON.stringify(incorrectMockData) },
        { body: JSON.stringify(incorrectMockData) },
        { body: JSON.stringify(correctMockData) },
        { body: JSON.stringify(correctMockData) }
      ] });
      // @ts-ignore
      expect(mockFn.mock.calls[mockFn.mock.calls.length - 3][0])
        .toContain(validationMessage);
      expect(mockFn.mock.calls[mockFn.mock.calls.length - 3][0])
        .toContain(validationMessage);
      expect(mockFn.mock.calls[mockFn.mock.calls.length - 2][0])
        .toContain(successMessage);
      expect(mockFn.mock.calls[mockFn.mock.calls.length - 2][0])
        .toContain(successMessage);
    });
});