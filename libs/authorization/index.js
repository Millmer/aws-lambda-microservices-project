const _ = require('lodash');

module.exports.authorizeUserId = async (event) => {
    const cognitoAuthenticationProvider = _.get(event, 'requestContext.identity.cognitoAuthenticationProvider', '');
    const cognitoUserId = cognitoAuthenticationProvider ? cognitoAuthenticationProvider.split(':')[2] : '';
    const uriUserId = event.pathParameters.user_id;

    console.info('Authorize user id for cognito user: ', cognitoUserId);

    if(cognitoUserId !== uriUserId) {
        console.error('User ' + cognitoUserId + ' is not authorized to access resource belongs to user ' + uriUserId);
        throw {
            statusCode: 403,
            statusMessage: 'User is unauthorized for resource'
        };
    }
};

module.exports.getCognitoSessionUserID = async (event) => {
    const cognitoAuthenticationProvider = _.get(event, 'requestContext.identity.cognitoAuthenticationProvider', '');
    const cognitoUserId = cognitoAuthenticationProvider ? cognitoAuthenticationProvider.split(':')[2] : '';
    if (cognitoUserId) {
        console.info('Got user id for cognito user: ', cognitoUserId);
        return cognitoUserId;
    } else {
        console.error('Cognito UserID not found');
        throw {
            statusCode: 404,
            statusMessage: 'User not found'
        };
    }
}