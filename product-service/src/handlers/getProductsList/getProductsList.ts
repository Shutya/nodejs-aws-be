import { APIGatewayProxyHandler } from 'aws-lambda';
import axios from 'axios';
import { defaultCors } from 'src/constants/cors';
import products from 'src/data/products.json';

export const getProductsList: APIGatewayProxyHandler = async () => {
  try {
    // Request only for async/await requirement
    try {
      const resp = await axios.get(`http://newsapi.org/v2/sources?apiKey=${process.env.NEWS_API_KEY}`);
      console.log(`news: ${resp.data}`);
    }
    catch (err) {
      console.log(`News api isn't working. ${err}`);
    }

    return {
      statusCode: 200,
      headers: defaultCors,
      body: JSON.stringify(products, null, 2),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: 'Internal server error'
    };
  }
};
