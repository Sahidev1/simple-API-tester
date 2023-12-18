const fs = require('fs');
const path = require('path');
const VARPATH = path.join(__dirname, '../data/variables.json');

class VarAccesor{
    constructor(set_id){
        try {
            this.set_id = set_id;
            this.loaderVarObject = JSON.parse(fs.readFileSync(VARPATH));
            this.globals = this.loaderVarObject[set_id].globals;
            this.locals = this.loaderVarObject[set_id].locals;
        } catch (error) {
            throw new Error("Failed to load variables", {cause: error});
        }
    }

    persistSetLocal(local_key, value){
        try {
            if (arguments.length != 2) throw new Error("Invalid nr of arguments");
            this.setLocal(local_key,value);
            this.loaderVarObject[this.set_id].locals = this.locals;
            fs.writeFileSync(VARPATH,JSON.stringify(this.loaderVarObject));
        } catch (error) {
            throw new Error("Failed to persist local variable", {cause: error});
        }
    }

    persistCreateGlobal(global_key, value){
        try {
            if (this.globals[global_key]) throw new Error("global already exists");
            this.globals[global_key] = value;
            this.loaderVarObject[this.set_id].globals = this.globals;
            fs.writeFileSync(VARPATH,JSON.stringify(this.loaderVarObject));
        } catch (error) {
            throw new error("Failed to persist global variable", {cause: error});
        }
    }

    setLocal(local_key, value){
        this.locals[local_key] = value;
    }

    getLocal(local_key){
        return this.locals[local_key];
    }

    getGlobal(global_key){
        return this.globals[global_key];
    }
}

module.exports = VarAccesor;