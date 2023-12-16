
const setLoader = require('./src/setLoader');
const RequestTest = require('./src/RequestTest');


const set = setLoader('auth_micro');

let test = new RequestTest(set, 'entry', (res) => {
    return res.status == '200';
});

let test0 = new RequestTest(set, 'login', (res) => {
    return res.status == '200';
},{listenForCookies: true, getData: true});

test.run().then(res => console.log(res)).catch(err => console.log(err));

test0.run().then(res => console.log(res)).catch(err => console.log(err));