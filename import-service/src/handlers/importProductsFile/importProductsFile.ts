import { APIGatewayProxyHandler } from 'aws-lambda';
import AWS from 'aws-sdk';
import Joi from 'joi';
import { defaultCors } from 'lib/constants/cors';

export const importProductsFile: APIGatewayProxyHandler = async (event) => {
  try {
    console.log('queryStringParameters', event.queryStringParameters);

    const name = event.queryStringParameters?.name;

    const { error } = Joi
      .string()
      .pattern(/^[\w,\s-]+\.csv$/, { name: 'csv' })
      .required()
      .validate(name);

    if (error) {
      return {
        statusCode: 400,
        headers: defaultCors,
        body: error?.message,
      };
    }

    const s3 = new AWS.S3();

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `uploaded/${name}`,
      ContentType: 'text/csv',
      ACL: 'public-read'
    };

    const signedUrl = await s3.getSignedUrlPromise('putObject', params);

    return {
      statusCode: 202,
      headers: defaultCors,
      body: signedUrl,
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: defaultCors,
      body: 'Internal server error'
    };
  }
};
