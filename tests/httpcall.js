const request = require('request');
const Q = require('q');

let defer = Q.defer();

request.get('http://nodejs.org/dist/index.json', function (error, response, body) {
    if (error) {
        return defer.reject(error);
    }
    defer.resolve(body);
});

module.exports = defer.promise;