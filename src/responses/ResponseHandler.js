const methods = require("../requests/methods");
const headers = require("./headers");

class ResponseHandler {
    respBodyTypes = {JSON: "json", TEXT: "text"};

    constructor(response, respBodyType=null) {
        this.response = response;
        this.Allheaders = headers;
        Object.seal(this.Allheaders);
        this.headers = {};
        this.#initHeaders();
        this.respBodyType = respBodyType;
        this.statusCode = response.status;
    }

    #initHeaders(){
        Object.keys(this.Allheaders).forEach(key => {
            if (this.response.headers.has(key.toLowerCase())){
                this.Allheaders[key] = this.response.headers.get(key.toLowerCase());
                this.headers[key] = this.Allheaders[key];
            }
        })
    }

    getStatusCode(){
        return this.statusCode;
    }

    async getResponseBodyData(dataType=null){
        try {
            if (!dataType && !this.respBodyType) throw new Error("No body type data found");
            const type = dataType || this.respBodyType;
            switch (type) {
                case this.respBodyTypes.JSON:
                    return await this.response.json();
                case this.respBodyTypes.TEXT:
                    return await this.response.text();
                default:
                    throw new Error("Unknown bodytype")
            }
        } catch (error) {
            throw new Error("Failed to get response body data", {cause: error});
        }
    }

    getHeaders(){
        return this.headers;
    }

    hasHeader(key){
        return this.headers.hasOwnProperty(key);
    }

    getHeader(key){
        return this.headers[key];
    }

    getSetCookie(){
        return this.headers["Set-Cookie"];
    }
}

module.exports = ResponseHandler;