const headersWhiteList = ['authorization'];

export const getAcceptedHeaders = (headers): Object =>
  Object.entries(headers).reduce((acc, [key, value]) => {
    if (headersWhiteList.includes(key)) {
      acc[key] = value;
    }
    return acc;
  }, {});