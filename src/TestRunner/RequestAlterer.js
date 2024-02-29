
const _= require('lodash');


/**
 * Represents a RequestAlterer object that modifies HTTP request properties.
 * @class
 */
class RequestAlterer {
    #initRequest;

    /**
     * Creates a new instance of RequestAlterer.
     * @param {Object} request - The HTTP request object.
     * @throws {Error} - If invalid arguments are provided.
     */
    constructor(request) {
        try {
            if (!request) throw new Error("Invalid arguments");
            this.request = request;
            this.#initRequest = _.cloneDeep(this.request);
        } catch (error) {
            throw new Error("Failed to create RequestAlterer instance", { cause: error });
        }
    }

    /**
     * Sets the URL of the request.
     * @param {String} url - The new URL.
     */
    setURL(url) {
        this.request.url = url;
    }

    setParams(params) {
        this.request.params = params;
    }

    /**
     * Sets the method of the request.
     * @param {String} method - The new method.
     */
    setMethod(method){
        this.request.method = method;
    }

    /**
     * Sets the headers of the request.
     * @param {Object} newHeaders - The new headers.
     */
    setHeaders(newHeaders) {
        this.request.headers = newHeaders;
    }

    /**
     * Sets the body of the request.
     * @param {Object} newBody - The new body.
     */
    setBody(newBody) {
        this.request.body = newBody;
    }

    /**
     * Gets the URL of the request.
     * @returns {String} - The URL.
     */
    getURL() {
        return this.request.url;
    }

    /**
     * Gets the method of the request.
     * @returns {String} - The method.
     */
    getMethod() {
        return this.request.method;
    }

    /**
     * Gets a copy of the headers of the request.
     * @returns {Object} - The headers.
     */
    getHeaders() {
        return _.cloneDeep(this.request.headers);
    }

    /**
     * Gets a copy of the body of the request.
     * @returns {Object} - The body.
     */
    getBody() {
        return _.cloneDeep(this.request.body);
    }

    setParamProp(propKey, newVal) {
        try {
            if (!this.request.params[propKey]) throw new Error("Property not found");
            this.request.params[propKey] = newVal;
        } catch (error) {
            throw new Error("Failed to set param property", { cause: error });
        }
    }

    /**
     * Sets a property of the request body.
     * @param {String} propKey - The property key.
     * @param {any} newVal - The new value.
     * @throws {Error} - If the property is not found.
     */
    setBodyProp(propKey, newVal) {
        try {
            if (!this.request.body[propKey]) throw new Error("Property not found");
            this.request.body[propKey] = newVal;
        } catch (error) {
            throw new Error("Failed to set body property", { cause: error });
        }
    }

    /**
     * Resets the request to its initial state.
     */
    resetRequest() {
        Object.keys(this.#initRequest).forEach(key => {
            this.request[key] = this.#initRequest[key];
        });
    }
}

module.exports = RequestAlterer;