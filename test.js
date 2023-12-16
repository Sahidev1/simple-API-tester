
const setLoader = require('./src/setLoader');
const RequestTest = require('./src/RequestTest');
const CostumTest = require('./src/CostumTest');


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
    const costumtester = new CostumTest('auth_micro',{
        useCookie: true,
        includeRespData: true
    });
    
    const myCostumCallback = async() => {
        costumtester.createTestCallback('entry', (res) => {
            return res.status == '200';
        });
        costumtester.createTestCallback('login', (res) => {
            return res.status == '200';
        });

        let results = [];
        let res = await costumtester.runCallback('login');
        results = [...results, res];
        res = await costumtester.runCallback('entry');
        results = [...results, res];
        return results;
    }

    costumtester.attachCostumCallback('costum', myCostumCallback);
    const result = await costumtester.runCostumCallback('costum');
    console.log(result);
}

testCostumTest();
