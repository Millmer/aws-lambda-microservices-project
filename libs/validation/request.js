export async function requestValidation(event) {
    if (!event.body) throw { statusCode: 400, statusMessage: 'No request body found' };
    if (!event.pathParameters) throw { statusCode: 400, statusMessage: 'Request must contain path parameter(s)'};
}