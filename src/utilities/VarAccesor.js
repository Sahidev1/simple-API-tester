const fs = require('fs');
const AsyncLock = require('async-lock');
const path = require('path');
const VARPATH = path.join(__dirname, '../../data/variables.json');
const _= require('lodash');

const lock = new AsyncLock();
const LOCK = 'Lock';
/**
 * Represents a Variable Accessor.
 * @class
 */
class VarAccesor {
    /**
     * Creates an instance of VarAccesor.
     * @constructor
     * @param {string} varset_id - The ID of the variable set.
     * @returns {Promise<VarAccesor>} - The VarAccesor instance.
     */
    static async asyncConstruct(varset_id=null) {
        try {
            let instance = new VarAccesor();
            await instance.#init();
            if (varset_id) instance.setVarSet(varset_id);
            return instance;
        } catch (error) {
            throw new Error("Failed to load variables", { cause: error });
        }
    }
    
    async #init(){
        try {
            let data = await this.#LockedCallback(() => fs.readFileSync(VARPATH));
            this.loadedVarObject = JSON.parse(data);
            this.virtualVarSet = {};
        } catch (error) {
            throw new Error("Failed to load variables", { cause: error });
        }
    }

    setVarSet(varset_id){
        try {
            if (!this.loadedVarObject[varset_id]) throw new Error("set not found");
            this.varset_id = varset_id;
            this.varset = this.loadedVarObject[varset_id];
            this.globals = _.cloneDeep(this.varset.globals);
            this.locals = _.cloneDeep(this.varset.locals);
        } catch (error) {
            throw new Error("Failed to set test set", { cause: error });
        }
    }

    checkIfTestSetLoaded(){
        if (!this.varset_id) throw new Error("no test set loaded");
    }

    /**
     * Persists a local variable to the variable set.
     * @param {string} local_key - The key of the local variable.
     * @param {any} value - The value of the local variable.
     * @throws {Error} If the number of arguments is invalid or if there is an error persisting the variable.
     */
    async persistVarSetLocal(local_key) {
        try {
            this.checkIfTestSetLoaded();
            this.varset.locals[local_key] = this.locals[local_key];
            await this.#LockedCallback(() => fs.writeFileSync(VARPATH, JSON.stringify(this.loadedVarObject)));
        } catch (error) {
            throw new Error("Failed to persist local variable", { cause: error });
        }
    }

    async #LockedCallback(callback) {
        try {
            return await lock.acquire(LOCK, () => callback(), { timeout: 500});
        } catch (error) {
            throw new Error("Failed to read callback", { cause: error });
        }
    }

    createVirtualVarSet(varset_id){
        try {
            if (this.loadedVarObject[varset_id]) throw new Error("var set with this ID already exists");
            this.varset = {globals:{}, locals:{}};
            this.virtualVarSet[varset_id] = this.varset;
            this.globals = this.varset.globals;
            this.locals = this.varset.locals;
        } catch (error) {
            throw new Error("Failed to create var set", { cause: error });
        }
    }

    copyAndCreateVirtualVarSet(varset_id, copy_varset_id){
        try {
            if (!this.loadedVarObject[copy_varset_id]) throw new Error("var set with this ID does not exist");
            if (this.loadedVarObject[varset_id]) throw new Error("var set with this ID already exists");
            this.varset = _.cloneDeep(this.loadedVarObject[copy_varset_id]);
            console.log(this.varset)
            this.virtualVarSet[varset_id] = this.varset;
            this.globals = this.varset.globals;
            this.locals = this.varset.locals;
        } catch (error) {
            throw new Error("Failed to create var set", { cause: error });
        }
    }

    async persistVirtualVarSet(varset_id){
        try {
            if (!this.virtualVarSet[varset_id]) throw new Error("no virtual var set with this ID exists");
            this.loadedVarObject[varset_id] = this.virtualVarSet[varset_id];
            await this.#LockedCallback(() => fs.writeFileSync(VARPATH, JSON.stringify(this.loadedVarObject)));            
        } catch (error) {
            throw new Error("Failed to persist virtual varset set", { cause: error });
        }
    }

    /**
     * creates and Persists a global variable to the variable set.
     * @param {string} global_key - The key of the global variable.
     * @param {any} value - The value of the global variable.
     * @throws {Error} If the global variable already exists or if there is an error persisting the variable.
     */
    async persistNewGlobal(global_key){
        try {
            this.checkIfTestSetLoaded();
            if (this.loadedVarObject[this.varset_id].globals[global_key]) throw new Error("global already exists");
            this.loadedVarObject[this.varset_id].globals[global_key] = this.globals[global_key];
            await this.#LockedCallback(() => fs.writeFileSync(VARPATH, JSON.stringify(this.loadedVarObject)));
        } catch (error) {
            throw new Error("Failed to persist global variable", { cause: error });
        }
    }

    async persistAll(){
        try {
            this.checkIfTestSetLoaded();
            this.loadedVarObject[this.varset_id].globals = this.globals;
            this.loadedVarObject[this.varset_id].locals = this.locals;
            await this.#LockedCallback(() => fs.writeFileSync(VARPATH, JSON.stringify(this.loadedVarObject)));
        } catch (error) {
            throw new Error("Failed to persist all variables", { cause: error });
        }
    }

    /**
     * Sets the value of a local variable.
     * @param {string} local_key - The key of the local variable.
     * @param {any} value - The value of the local variable.
     */
    setLocal(local_key, value) {
        if(!this.locals[local_key]) throw new Error("local var not found");
        this.locals[local_key] = value;
    }

    /**
     * Gets the value of a local variable.
     * @param {string} local_key - The key of the local variable.
     * @returns {any} The value of the local variable.
     */
    getLocal(local_key) {
        if(!this.locals[local_key]) throw new Error("local var not found");
        return this.locals[local_key];
    }

    /**
     * Gets the value of a global variable.
     * @param {string} global_key - The key of the global variable.
     * @returns {any} The value of the global variable.
     */
    getGlobal(global_key) {
        if (!this.globals[global_key]) throw new Error("global var not found");
        return this.globals[global_key];
    }

    createGlobal(global_key, value) {
        this.globals[global_key] = value;
    }

    createLocal(local_key, value) {
        this.locals[local_key] = value;
    }
}

module.exports = VarAccesor;