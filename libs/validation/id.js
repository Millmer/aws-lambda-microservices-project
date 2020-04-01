export async function pathParametersIdValidation(event, ids = ['id']) {
    if (!event.pathParameters) throw { statusCode: 400, statusMessage: 'Request must contain path parameter(s)'};
    const parameters = {};
    ids.forEach(id => {
        if(!event.pathParameters[id]) throw { statusCode: 400, statusMessage: `Request must contain ${id}`};
        parameters[id] = event.pathParameters[id];
    });
    return parameters;
}