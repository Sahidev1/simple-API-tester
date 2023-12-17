class CookieTracker{
    constructor(initCookie=null){
        this.cookie = initCookie;
        this.cookieHistory = [];
    }

    /**
     * 
     * @param {string} newCookie 
     */
    updateCookie(newCookie){
        this.cookie = newCookie;
        this.cookieHistory.push(newCookie);
    }

    /**
     * 
     * @returns {string}
     */
    getCurrentCookie(){
        return this.cookie;
    }

    /**
     * 
     * @returns {boolean}
     */
    hasCookie(){
        return this.cookie?true:false;
    }

    /**
     * 
     * @returns {string[]}
     */
    getCookieHistory(){
        return this.cookieHistory;
    }
}

module.exports = CookieTracker;