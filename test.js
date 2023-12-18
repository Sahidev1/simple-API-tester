
const setLoader = require('./src/setLoader');
const RequestTest = require('./src/RequestTest');
const CustomTest= require('./src/SetTester');
const CookieTracker = require('./src/CookieTracker');
const SetTester = require('./src/SetTester');
const SimpleAPITester = require('./src/SimpleAPITester');


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
    const costumtester = new SetTester('auth_micro',{
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

async function apiTester0(){
    try {
        const tester = new SimpleAPITester();
        tester.loadSetTester('auth_micro', {
            useCookie: true,
            includeRespData: true
        });

        const authmicroSet = tester.getSetTester('auth_micro');
        const checkOK = (res) => {return res.status == '200'};
        const alterer  = authmicroSet.getNewRequestAlterer('register');
        const logAlterer = authmicroSet.getNewRequestAlterer('login');
        const varAccesor = authmicroSet.getVarAccessor();

        const cookietracker = new CookieTracker(authmicroSet.initCookie);

        const testProcedure = async(index) => {
            let regIndex = varAccesor.getLocal('regIndex');
            let pnrLast4 = varAccesor.getLocal('PnrLast4');
            varAccesor.persistSetLocal('regIndex',regIndex + 1);
            varAccesor.persistSetLocal('PnrLast4',pnrLast4 + 1);

            const body = alterer.getInitBody();
            let username = body.username;
            let email = body.email;
            username = username + parseInt(regIndex);
            email = username + varAccesor.getGlobal('emailService');
            let pnr = varAccesor.getGlobal('dof');
            pnr = pnr + pnrLast4;

            alterer.setBodyProp('username',username);
            alterer.setBodyProp('pnr',pnr);
            alterer.setBodyProp('email', email);

            logAlterer.setBodyProp('username',username);


            authmicroSet.createTestCallback('register', checkOK);
            authmicroSet.createTestCallback('login', checkOK);
            authmicroSet.createTestCallback('entry-createApp', checkOK);
            authmicroSet.createTestCallback('logout', checkOK);
          
            const res = await authmicroSet.runAllCallbacksInSequence(['register','login', 'entry-createApp' ,'logout'], cookietracker, true);
            return res;
        }

        tester.attachTestProcedure('regtest','auth_micro', testProcedure, 3,true);
        const result = await tester.runTestProcedure('auth_micro','regtest' );
        console.log(result);
        console.log(cookietracker)
    } catch (error) {
               const logger = (error) => {
            if (error.cause) console.log(error.cause);
            else {
                console.log(error);
                return;
            }
            logger(error.cause);
        }
        logger(error);
    }
}

async function testAPItester(){
    try {
        const tester = new SimpleAPITester();;
        tester.loadSetTester('auth_micro', {
            useCookie: true,
            includeRespData: true
        });
        

        const myCostumCallback = async(index) => {
            const setTester = tester.getSetTester('auth_micro');
            const alterer = setTester.getNewRequestAlterer('entry');
            const checkOK = (res) => {return res.status == '200';};
            setTester.createTestCallback('entry', checkOK);
            setTester.createTestCallback('login', checkOK);
            setTester.createTestCallback('logout', checkOK);
            setTester.createTestCallback('register', checkOK);
            setTester.createTestCallback('login-recruiter', checkOK);


            
            const cookieTracker = new CookieTracker(setTester.initCookie);

            const res = await setTester.runAllCallbacksInSequence(['entry','login','logout', 'register', 'login-recruiter', 'logout'], cookieTracker);
            return res;
        }

        tester.attachTestProcedure('costum', 'auth_micro', myCostumCallback, 4, true);
        const result = await tester.runTestProcedure('auth_micro', 'costum');
        console.log(result);
    } catch (error) {
        const logger = (error) => {
            if (error.cause) console.log(error.cause);
            else {
                console.log(error);
                return;
            }
            logger(error.cause);
        }
        logger(error);
    }
}

async function testAPItester2(){
    try {
        SetTester.createMergedSet('auth_micro','applcreate', 'merged_set');
        const tester = new SimpleAPITester();
        tester.loadSetTester('merged_set', {
            useCookie: true,
            includeRespData: true
        });
    } catch (error) {
        
    }
}
//testCostumTest();
//testAPItester();
apiTester0();