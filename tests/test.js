const asyncify = require('../index')
async function run() {
    let response = await asyncify('./call');
    console.log('response', response);
}
run();