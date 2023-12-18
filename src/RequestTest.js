
/**
 * Represents a request test.
 * @class
 */
const axios = require('axios');

class RequestTest {
    /**
     * Creates a new RequestTest instance.
     * @constructor
     * @param {Object} request - The request object.
     * @param {function} assertCB - The assertion callback function.
     * @param {Object} [options] - The optional parameters.
     * @param {string} [options.cookie] - The cookie value.
     * @param {boolean} [options.listenForCookies] - Indicates whether to listen for cookies in the response.
     * @param {boolean} [options.getData] - Indicates whether to include response data in the result.
     * @param {Object} [options.customBody] - The custom request body.
     */
    constructor(request, req_id, assertCB=null, options=null){
        if (!request) throw new Error('invalid request object');
        this.request = request;
        this.assertCB = assertCB;
        this.options = options;
        this.request_id = req_id;
    }

    /**
     * Creates a test result object.
     * @private
     * @param {Object} res - The response object.
     * @param {Number} res_time - The response time in milliseconds.
     * @returns {Object} - The test result object.
     */
    #create_test_res(res, res_time){
        try {
            let test_status = {
                "request-id":this.request_id,
                "status": res.status,
                "response-time_ms": Math.round(res_time),
            }
            if (this.assertCB) {
                test_status['assertion'] = this.assertCB(res)?"passed":"failed";
            }
            return test_status;
        } catch (error) {
            throw new Error("Failed to create test result");
        }
    }

    /**
     * Runs the request test.
     * @async
     * @returns {Object} - The test result.
     * @throws {Error} - If the request test fails.
     */
    async run(){
        try {
            let req = this.request;
            if (this.options?.cookie) req.headers['cookie'] = this.options.cookie;
            let conf = {
                method: req.method,
                maxBodyLength: Infinity,
                url: req.url,
                headers: req.headers || {},
                data: this.options?.customBody || req.body || {}
            };
            let start_ms = performance.now();
            const res = await axios(conf);
            let end_ms = performance.now();
            let testres = this.#create_test_res(res, end_ms-start_ms);
            let result = {"test-result": testres};
            if (this.options?.listenForCookies && res.headers["set-cookie"]){
                result["set-cookie"]=res.headers["set-cookie"];
            }
            if (this.options?.getData){
                result["data"]=res.data;
            }
            return result;
        } catch (error) {
            if (error.response) return {"test-result": this.#create_test_res(error.response, 0)};
            else throw new Error("Failed to run request test", {cause: error});
        }
    }
}

module.exports = RequestTest;
