const RequestAlterer = require("./RequestAlterer");
const VarAccesor = require("./VarAccesor");

class SetTestWrapper{
    constructor(setTester){
        this.setTester = setTester;
        this.initCookie = setTester.initCookie;
    }

    setAllRequestCallbacks(assertCB){
        this.setTester.setAllRequestCallbacks(assertCB);
    }

    async runAllCallbacksInSequence(seq, cookieTracker=null, getcookies=false){
        return await this.setTester.runAllCallbacksInSequence(seq, cookieTracker, getcookies);
    }

    async runAllCallbacks(cookieTracker=null){
        return await this.setTester.runAllCallbacks(cookieTracker);
    }  

    /**
     * @returns {VarAccesor}
     */
    getVarAccessor(){
        return this.setTester.getVarAccessor();
    }

    /**
     * 
     * @param {*} req_id 
     * @returns {RequestAlterer}
     */
    getNewRequestAlterer(req_id){
        return this.setTester.getNewRequestAlterer(req_id);
    }

    createTestCallback(req_id, assertCB=null){
        this.setTester.createTestCallback(req_id, assertCB);
    }

    async runCallback(req_id, cookieTracker=null, getCookieTracker=false){
        return await this.setTester.runCallback(req_id, cookieTracker, getCookieTracker);
    }
}

module.exports = SetTestWrapper;