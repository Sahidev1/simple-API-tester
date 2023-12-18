
const CookieTracker = require('./src/CookieTracker');
const SimpleAPITester = require('./src/SimpleAPITester');



async function testAPItester(){
    try {
        const tester = new SimpleAPITester(); // creating a new instance of SimpleAPITester
        tester.loadSetTester('sampleTestSet', {
            useCookie: true,
            includeRespData: true
        }); // loading a set tester instance with ID 'sampleTestSet' and options, make 
        // the set exists in set.json file. Check samepleTestSet.json for an example.

        const authmicroSet = tester.getSetTester('sampleTestSet'); // getting the set tester instance
        // use it in the test procedure callback;
        const checkOK = (res) => {return res.status == '200'}; // an assertion callback, test passes if this returns true
        // not assertion callbacks handle axious response objects

        // getting a new request alterer for the request with ID 'register'
        // use it to alter the request body, headers, etc.
        const alterer  = authmicroSet.getNewRequestAlterer('register');

        // getting a new request alterer for the request with ID 'login'
        const logAlterer = authmicroSet.getNewRequestAlterer('login');

        // we get a variable accessor instance to access global and local variables
        // for the set tester instance
        const varAccesor = await authmicroSet.getVarAccessor();

        // we get a cookie tracker instance to track cookies
        const cookietracker = new CookieTracker(authmicroSet.initCookie);

        // we create a test procedure callback, index is optional, the index number of times test procedure has been called so far
        const testProcedure = async(index) => {
            let randIndex = varAccesor.getLocal('randIndex');
            let randLocal = varAccesor.getLocal('randLocal');
            varAccesor.persistSetLocal('randIndex',randIndex + 1);
            varAccesor.persistSetLocal('randLocal',randLocal + 1);

            const body = alterer.getInitBody();
            
            let username = body.username;
            let email = body.email;
            username = username + parseInt(randIndex);
            email = username + varAccesor.getGlobal('emailService');
            let globvar = varAccesor.getGlobal('dof');
            globvar = globvar + randLocal;

            alterer.setBodyProp('username',username);
            alterer.setBodyProp('randprop',globvar);
            alterer.setBodyProp('email', email);

            logAlterer.setBodyProp('username',username);


            authmicroSet.createTestCallback('register', checkOK);
            authmicroSet.createTestCallback('login', checkOK);
            authmicroSet.createTestCallback('entry-createApp', checkOK);
            authmicroSet.createTestCallback('logout', checkOK);
          
            const res = await authmicroSet.runAllCallbacksInSequence(['register','login', 'entry-createApp' ,'logout'], cookietracker, true);
            return res;
        }

        // We attach the to the simple API tester instance
        tester.attachTestProcedure('regtest','sampleTestSet', testProcedure, 3,true);
        // We run the test procedure
        const result = await tester.runTestProcedure('sampleTestSet','regtest' );
        // we log the result
        console.log(result);
        // we log the cookies and cookie history
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