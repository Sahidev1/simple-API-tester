const SetTestWrapper = require("./SetTestWrapper");
const SetTester = require("./SetTester");
const RequestAlterer = require("./RequestAlterer")

class SimpleAPITester {
    constructor(){
        this.setTesters = {};
    }

    loadSetTester(set_id, opts=null){
        try {
            this.setTesters[set_id] = {testerInstance: new SetTester(set_id,opts), tests:{}};
        } catch (error) {
            throw new Error("Failed to load set tester", {cause: error});
        }
    }

    attachTestProcedure(test_id, set_id, testCB=null, iterations=1, indexed=false){
        try {
            if (!this.setTesters[set_id]) throw new Error("Set tester not loaded");
            this.setTesters[set_id].testerInstance.attachTestProcedure(test_id, testCB);
            this.setTesters[set_id].tests[test_id] = { iterations: iterations, indexed: indexed };
        } catch (error) {
            throw new Error("Failed to attach test procedure", {cause: error});
        }
    }

    /**
     * 
     * @param {String} set_id 
     * @returns {SetTestWrapper}
     */
    getSetTester(set_id){
        try {
            if (!this.setTesters[set_id]) throw new Error("Set tester not loaded");
            return new SetTestWrapper(this.setTesters[set_id].testerInstance);
        } catch (error) {
            throw new Error("Failed to get set tester", {cause: error});
        }
    }

    async runTestProcedure(set_id, test_id, logdata=false){
        try {
            if (!this.setTesters[set_id]) throw new Error("Set tester not loaded");
            let iters = this.setTesters[set_id].tests[test_id].iterations;
            let indexed = this.setTesters[set_id].tests[test_id].indexed;
            console.log(iters)
            let result = {};
            for (let i = 0; i < iters; i++) {
                let res = await this.setTesters[set_id].testerInstance.runTestProcedure(test_id, indexed?i:null);
                if (!Array.isArray(res)) res = [res];
                if (logdata) console.log(res);
                res.forEach(e => {
                    if (e['cookieTracker']) {
                        if(logdata) console.log(e['cookieTracker']);
                        e = e['result'];
                    }
                    if (!result[e['test-result']['request-id']]) {
                        if (e['test-result']['assertion'] == 'passed') {
                            result[e['test-result']['request-id']] = { passed: 1, failed: 0 };
                        } else {
                            result[e['test-result']['request-id']] = { passed: 0, failed: 1 };
                        }
                    } else {
                        if (e['test-result']['assertion'] == 'passed') {
                            result[e['test-result']['request-id']].passed += 1;
                        } else {
                            result[e['test-result']['request-id']].failed += 1;
                        }
                    }
                });
            }
            return result;
        } catch (error) {
            throw new Error("Failed to run test procedure", { cause: error });
        }
    }
}

module.exports = SimpleAPITester;