
const Requester = require('./src/requests/Requester.js')

async function testRequester(){
    const requester = new Requester();
    requester.LoadHeaders({
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
    });

    const res = await requester.httpGet("localhost:8000");
    console.log(res);
}

testRequester();