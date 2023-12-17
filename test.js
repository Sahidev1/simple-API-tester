
const setLoader = require('./src/setLoader');
const RequestTest = require('./src/RequestTest');
const CustomTest= require('./src/CustomTest');
const CookieTracker = require('./src/CookieTracker');


const testfun0 = () => {
    const set = setLoader('auth_micro');

    let test = new RequestTest(set, 'entry', (res) => {
        return res.status == '200';
    });

    let test0 = new RequestTest(set, 'login', (res) => {
        return res.status == '200';
    }, { listenForCookies: true, getData: true });

    test.run().then(res => console.log(res)).catch(err => console.log(err));

    test0.run().then(res => console.log(res)).catch(err => console.log(err));
}

async function testCostumTest(){
    const costumtester = new CustomTest('auth_micro',{
        useCookie: true,
        includeRespData: true
    });
    
    const myCostumCallback = async() => {
        const checkOK = (res) => {return res.status == '200';};
        costumtester.createTestCallback('entry', checkOK);
        costumtester.createTestCallback('login', checkOK);
        costumtester.createTestCallback('logout', checkOK);
        costumtester.createTestCallback('register', checkOK);

        const cookieTracker = new CookieTracker(costumtester.initCookie);

        const res = await costumtester.runAllCallbacksInSequence(['entry','login','logout', 'register'], cookieTracker);
        return res;
    }

    costumtester.attachTestProcedure('costum', myCostumCallback);
    const result = await costumtester.runTestProcedure('costum');
    console.log(result);
    
}

testCostumTest();
