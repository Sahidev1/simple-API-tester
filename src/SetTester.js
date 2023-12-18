/**
 * Represents a SetTester class that is used to test a set of requests.
 * @class
 */
const CookieTracker = require("./CookieTracker");
const RequestAlterer = require("./RequestAlterer");
const RequestTest = require("./RequestTest");
const VarAccesor = require("./VarAccesor");
const setLoader = require("./setLoader");

class SetTester {
    /**
     * Creates an instance of SetTester.
     * @param {Object} set_id - The ID of the set.
     * @param {Object} [options] - Additional options.
     * @param {boolean} [options.useCookie] - Whether to use cookies.
     * @param {string} [options.myCookie] - The initial cookie value.
     * @param {boolean} [options.includeRespData] - Whether to include response data.
     */
    constructor(set_id, options=null){
        try {
            this.set_id = set_id;
            this.options = options;
            this.set = setLoader(set_id);
            this.#init();
        } catch (error) {
            throw new Error("Failed to create CostumTest instance", {cause:error});
        }
    }

    /**
     * Initializes the SetTester instance.
     * @private
     */
    #init(){
        try {
            this.request_ids = Object.keys(this.set.requests);
            if (this.options?.useCookie) this.useCookie = true;
            if (this.options?.myCookie) this.initCookie = this.options.myCookie;
            if (this.options?.includeRespData) this.includeRespData = true;
            this.testCallback = this.request_ids.reduce((acc, currKey) => {
                acc[currKey] = null;
                return acc;
            },{});
            (JSON.stringify(this.testCallback))
            this.costumCallback = {};
        } catch (error) {
            throw new Error("Failed to initialize costum test");
        }
    }

    /**
     * Creates the options object for a request.
     * @param {CookieTracker} [cookieTracker=null] - The cookie tracker instance.
     * @returns {Object} The options object.
     * @private
     */
    #createOptions(cookieTracker=null){
        const opt = {};
        if (this.useCookie) opt.listenForCookies = true;
        if (this.includeRespData) opt.getData = true;
        if (this.useCookie){
            if (this.initCookie && !cookieTracker?.hasCookie()){
                opt.cookie = this.initCookie;
            }
            else if (cookieTracker?.hasCookie()){
                opt.cookie = cookieTracker.getCurrentCookie();
            }
            else {
                opt.cookie = null;
            }
        }
        return opt;
    }
    
    /**
     * Sets the assertion callback for all requests.
     * @param {Function} assertCB - The assertion callback function.
     */
    setAllRequestCallbacks(assertCB){
        try {
            for (const key in this.testCallback){
                this.createTestCallback(key, assertCB);
            }
        } catch (error) {
            throw new Error("Failed to set all request callbacks", {cause:error});
        }
    }

    /**
     * Gets a new instance of VarAccesor.
     * @returns {VarAccesor} A new instance of VarAccesor.
     */
    async getVarAccessor(){
        try {
            return await VarAccesor.asyncConstruct(this.set_id);
        } catch (error) {
            throw new Error("Failed to get variable accessor", {cause:error});
        }
    }

    /**
     * Runs all callbacks in a sequence.
     * @param {Array} seq - The sequence of request IDs.
     * @param {CookieTracker} [cookieTracker=null] - The cookie tracker instance.
     * @param {boolean} [getcookies=false] - Whether to get the cookie tracker instance in the result.
     * @returns {Array} An array of results.
     */
    async runAllCallbacksInSequence(seq, cookieTracker=null, getcookies=false){
        try {
            const results = [];
            for (let i = 0; i < seq.length; i++) {
                const req_id = seq[i];
                let res = await this.runCallback(req_id, cookieTracker);
                if (getcookies && i === seq.length - 1){
                    results.push({"result": res, "cookieTracker": cookieTracker});
                } else {
                    results.push(res);
                }
            }
            return results;
        } catch (error) {
            throw new Error("in sequence call of callbacks failed", {cause:error});
        }
    }

    /**
     * Runs all callbacks.
     * @param {CookieTracker} [cookieTracker=null] - The cookie tracker instance.
     * @returns {Object} An object containing the results of all callbacks.
     */
    async runAllCallbacks(cookieTracker=null){
        try {
            let results = {};
            for (const key in this.testCallback){
                if (this.testCallback[key]){
                    results[key] = await this.runCallback(key, cookieTracker);
                }
            }
            return results;
        } catch (error) {
            throw new Error("Failed to run all callbacks", {cause:error});
        }
    }

    /**
     * Creates a callback for a specific request.
     * @param {String} req_id - The ID of the request.
     * @param {Function} assertionCB - The assertion callback function.
     * @param {CookieTracker} [cookieTracker=null] - The cookie tracker instance.
     */
    createTestCallback(req_id, assertionCB=null){
        try {
            if (!this.testCallback.hasOwnProperty(req_id)) throw new Error("invalid request identifier");
            this.testCallback[req_id] = async (cookieTracker=null)=> {
                const opt = this.#createOptions(cookieTracker);
                let test = new RequestTest(this.set.requests[req_id],req_id, assertionCB, opt);
                let result = await test.run();
                if (result?.["set-cookie"] && cookieTracker) cookieTracker.updateCookie(result["set-cookie"]);
                return result;
            }
        } catch (error) {
            throw new Error("Failed to add callback", {cause:error});
        }
    }

    /**
     * Gets a new instance of RequestAlterer for a specific request.
     * @param {String} req_id - The ID of the request.
     * @returns {RequestAlterer} A new instance of RequestAlterer.
     */
    getNewRequestAlterer(req_id){
        try {
            if(!this.set.requests[req_id]) throw new Error("Set tester not loaded");
            return new RequestAlterer(this.set.requests[req_id]);
        } catch (error) {
            throw new Error("Failed to get new request alterer", {cause:error});
        }
    }

    /**
     * Runs a specific request callback.
     * @param {String} req_id - The ID of the request.
     * @param {CookieTracker} [cookieTracker=null] - The cookie tracker instance.
     * @param {boolean} [getCookieTracker=false] - Whether to get the cookie tracker instance in the result.
     * @returns {Object} An object containing the result and the cookie tracker instance.
     */
    async runCallback(req_id, cookieTracker=null, getCookieTracker=false){
        try {
            if (!this.testCallback?.[req_id]) throw new Error("invalid request identifier");
            const res = await this.testCallback[req_id](cookieTracker);
            if (getCookieTracker) return {res, cookieTracker};
            return res;
        } catch (error) {
            throw new Error("Failed to run callback", {cause:error});
        }
    }

    /**
     * Attaches a test procedure callback.
     * @param {String} callback_id - The ID of the callback.
     * @param {Function} callBack - The callback function.
     */
    attachTestProcedure(callback_id,callBack){
        try {
            this.costumCallback[callback_id] = callBack.bind(this);
        } catch (error) {
            throw new Error("Failed to attach costum callback", {cause:error});
        }
    }

    /**
     * Runs a specific test procedure callback.
     * @param {String} callback_id - The ID of the callback.
     * @param {number} [index=null] - The index to pass to the callback.
     * @returns {*} The result of the callback.
     */
    async runTestProcedure(callback_id, index=null){
        try {
            if (!this.costumCallback?.[callback_id]) throw new Error("invalid callback identifier");
            if (index !== null) return await this.costumCallback[callback_id](index);
            return await this.costumCallback[callback_id]();
        } catch (error) {
            throw new Error("Failed to run costum callback", {cause:error});
        }
    }
}
module.exports = SetTester;