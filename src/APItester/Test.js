const ResponseHandler = require("../responses/ResponseHandler");

class Test {
    #request;
    #assertCB;

    constructor(request, respDatatype=null ,returnData=false,listenForCookies=false, respAssertionCB=null){
        this.#request = request;
        this.listenForCookies = listenForCookies;
        this.returnData = returnData;
        this.#assertCB = respAssertionCB;
        this.respDatatype = respDatatype;
    }

    async Run(){
        try {
            const start = performance.now();
            const res = await this.#request.runAsyncRunner();
            const end = performance.now();
            const resp = new ResponseHandler(res, this.respDatatype);
            const testData = {time_ms: (end - start)};
            if (this.returnData && this.respDatatype) testData['body'] = await resp.getResponseBodyData();
            if (this.listenForCookies && resp.getSetCookie()) testData['Set-Cookie'] = resp.getSetCookie();
            if (this.respAssertionCB !== null){
                let testres = await this.#assertCB(resp);
                testData['test-result'] = testres?"pass":"fail";
            }
            return testData; 
        } catch (error) {
            throw new Error("Error while attempting to run test", {cause: error});
        }
    }
}

module.exports = Test;

