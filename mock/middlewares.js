module.exports = (request, res, next) => {
    console.log('-------------------------------')
    console.log('--------- new request ---------')
    console.log('-------------------------------')
    console.log('params:', request.params);
    console.log('query:', request.query);
    console.log('body:', request.body);
    console.log('headers:', request.headers);
    console.log('-------------------------------')
    console.log('-------------------------------')
    console.log('-------------------------------')
    if (request.method == 'POST') {
        request.method = 'GET';
        request.query = request.body
    }
    next()
};