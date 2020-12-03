import { APIGatewayTokenAuthorizerHandler, APIGatewayAuthorizerResult } from 'aws-lambda';

const createResult = (principalId, Resource, Effect = 'Allow'): APIGatewayAuthorizerResult => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect,
        Resource
      }
    ]
  }
});

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event) => {
  try {
    console.log('event: ', JSON.stringify(event));

    const [ tokenType, token ] = event.authorizationToken.split(' ');

    if (tokenType !== 'Basic') {
      console.log("tokenType isn't Basic");
      return createResult(event.authorizationToken, event.methodArn, 'Deny');
    }

    const [ username, password ] = Buffer.from(token, 'base64').toString('utf-8').split(':');

    console.log('username: ', username);
    console.log('password: ', password);

    const storedUserPassword = process.env[username];
    const effect = !storedUserPassword || storedUserPassword !== password ? 'Deny': 'Allow';

    return createResult(event.authorizationToken, event.methodArn, effect);
  } catch (e) {
    console.error(e.message);
    return createResult(event.authorizationToken, event.methodArn, 'Deny');
  }
};
