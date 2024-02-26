const CookieTracker = require("./utilities/CookieTracker");
const RequestAlterer = require("./utilities/RequestAlterer");

/**
 * Represents a wrapper class for SetTester.
 * @class
 */
class SetTestWrapper{
    /**
     * Creates an instance of SetTestWrapper.
     * @param {SetTester} setTester - The SetTester instance.
     */
    constructor(setTester){
        this.setTester = setTester;
        this.initCookie = setTester.initCookie;
    }

    /**
     * Sets the assert callback for all requests.
     * @param {Function} assertCB - The assert callback function.
     */
    setAllRequestCallbacks(assertCB){
        this.setTester.setAllRequestCallbacks(assertCB);
    }

    /**
     * Runs all callbacks in sequence.
     * @param {Array} seq - The sequence of callbacks.
     * @param {CookieTracker} [cookieTracker=null] - The cookie tracker object.
     * @param {boolean} [getcookies=false] - Flag to indicate if cookies should be retrieved.
     * @returns {Promise} - A promise that resolves when all callbacks are executed.
     */
    async runAllCallbacksInSequence(seq, cookieTracker=null, getcookies=false){
        return await this.setTester.runAllCallbacksInSequence(seq, cookieTracker, getcookies);
    }

    /**
     * Runs all callbacks.
     * @param {CookieTracker} [cookieTracker=null] - The cookie tracker object.
     * @returns {Promise} - A promise that resolves when all callbacks are executed.
     */
    async runAllCallbacks(cookieTracker=null){
        return await this.setTester.runAllCallbacks(cookieTracker);
    }  

    /**
     * Gets the variable accessor.
     * @returns {VarAccesor} - The variable accessor instance.
     */
    async getVarAccessor(){
        return await this.setTester.getVarAccessor();
    }

    /**
     * Gets a new request alterer.
     * @param {*} req_id - The request ID.
     * @returns {RequestAlterer} - The request alterer instance.
     */
    getNewRequestAlterer(req_id){
        return this.setTester.getNewRequestAlterer(req_id);
    }

    /**
     * Creates a test callback.
     * @param {*} req_id - The request ID.
     * @param {Function} [assertCB=null] - The assert callback function.
     */
    createTestCallback(req_id, assertCB=null){
        this.setTester.createTestCallback(req_id, assertCB);
    }

    /**
     * Runs a callback.
     * @param {*} req_id - The request ID.
     * @param {Object} [cookieTracker=null] - The cookie tracker object.
     * @param {boolean} [getCookieTracker=false] - Flag to indicate if cookie tracker should be retrieved.
     * @returns {Promise} - A promise that resolves when the callback is executed.
     */
    async runCallback(req_id, cookieTracker=null, getCookieTracker=false){
        return await this.setTester.runCallback(req_id, cookieTracker, getCookieTracker);
    }
}

module.exports = SetTestWrapper;