module.exports.errorResponse = function(error, defaultResponse, headers = {}) {
  return {
    statusCode: error.statusCode || 500,
    headers: {
      ...headers
    },
    body: JSON.stringify({ message: error.message || error.statusMessage || defaultResponse })
  }
};

module.exports.successResponse = function(status, body = {}, headers = {}) {
  return {
    statusCode: status || 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      ...headers
    },
    isBase64Encoded: false,
    body: JSON.stringify(body)
  }
};

module.exports.APIError = function(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}