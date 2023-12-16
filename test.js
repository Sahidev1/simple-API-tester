
const Test = require('./src/APItester/Test.js');
const Requester = require('./src/requests/Requester.js');
const ResponseHandler = require('./src/responses/ResponseHandler.js');

async function testRequester(){
    const requester = new Requester();
    requester.LoadHeaders({
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
    });

    const res = await requester.httpGet("http://localhost:8000");
    const resp = new ResponseHandler(res, "text");
    console.log(resp.getStatusCode());
    console.log(resp.getHeaders());
    resp.getResponseBodyData().then(data => console.log(data));
}

async function testTester(){
    let requester = new Requester('http://localhost:8000');
    requester.LoadHeaders({
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
    });
    requester.attachAsyncRunner(async () => { return await requester.httpGet()});
    let test = new Test(requester,'text',true,false,(resp) => {
        return resp.getStatusCode() == '200';
    });
    let testres = await test.Run();
    console.log(testres);
}

async function loginTest(){
    let requester = new Requester('http://localhost:8000/login');
    requester.LoadHeaders({
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Content-Type": "application/json"
    });
    requester.setBody({
        "username": "lamoado1",
        "password": "password"
    });
    requester.attachAsyncRunner(async () => { return await requester.httpPost()});
    let test = new Test(requester,'json',true,true,(resp) => {
        return resp.getStatusCode() == '200';
    });
    let testres = await test.Run();
    console.log(testres);
}
//testRequester();
testTester();
loginTest();