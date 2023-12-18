const SetTestWrapper = require("./SetTestWrapper");
const SetTester = require("./SetTester");
const RequestAlterer = require("./RequestAlterer")

/**
 * Represents a Simple API Tester.
 * @class
 */
class SimpleAPITester {
    constructor(){
        this.setTesters = {};
    }

    /**
     * Loads a set tester instance.
     * @param {string} set_id - The ID of the set tester.
     * @param {object} [opts=null] - Optional options for the set tester.
     * @throws {Error} If failed to load set tester.
     */
    loadSetTester(set_id, opts=null){
        try {
            this.setTesters[set_id] = {testerInstance: new SetTester(set_id,opts), tests:{}};
        } catch (error) {
            throw new Error("Failed to load set tester", {cause: error});
        }
    }

    /**
     * Attaches a test procedure to a set tester.
     * @param {string} test_id - The ID of the test procedure.
     * @param {string} set_id - The ID of the set tester.
     * @param {function} [testCB=null] - Optional callback function for the test procedure.
     * @param {number} [iterations=1] - Number of iterations for the test procedure.
     * @param {boolean} [indexed=false] - Indicates if the test procedure is indexed.
     * @throws {Error} If set tester is not loaded or failed to attach test procedure.
     */
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
     * Gets the set tester instance.
     * Use the set tester instance to attach request callbacks and to run callbacks.
     * This should be used within your procedure callback function.
     * @param {string} set_id - The ID of the set tester.
     * @returns {SetTestWrapper} The set tester instance.
     * @throws {Error} If set tester is not loaded or failed to get set tester.
     */
    getSetTester(set_id){
        try {
            if (!this.setTesters[set_id]) throw new Error("Set tester not loaded");
            return new SetTestWrapper(this.setTesters[set_id].testerInstance);
        } catch (error) {
            throw new Error("Failed to get set tester", {cause: error});
        }
    }

    /**
     * Runs a test procedure for a set tester.
     * @param {string} set_id - The ID of the set tester.
     * @param {string} test_id - The ID of the test procedure.
     * @param {boolean} [logdata=false] - Indicates if the test data should be logged.
     * @returns {Object} The result of the test procedure.
     * @throws {Error} If set tester is not loaded or failed to run test procedure.
     */
    async runTestProcedure(set_id, test_id, logdata=false){
        try {
            if (!this.setTesters[set_id]) throw new Error("Set tester not loaded");
            let iters = this.setTesters[set_id].tests[test_id].iterations;
            let indexed = this.setTesters[set_id].tests[test_id].indexed;
            let result = {};
            for (let i = 0; i < iters; i++) {
                let res = await this.setTesters[set_id].testerInstance.runTestProcedure(test_id, indexed?i:null);
                if (!Array.isArray(res)) res = [res];
                if (logdata) console.log(res);
                res.forEach(e => {
                    this.#handleResult(e, logdata, result);
                });
            }
            return result;
        } catch (error) {
            throw new Error("Failed to run test procedure", {cause: error});
        }
    }

    #handleResult(e, logdata, result) {
        if (e['cookieTracker']) {
            if (logdata) console.log(e['cookieTracker']);
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
    }
}

module.exports = SimpleAPITester;