const fs = require('fs');
const path = require('path');

const SETS_PATH = path.join(__dirname, '../data/sets.json');

function setLoader(set_id){
    try {
        let sets = JSON.parse(fs.readFileSync(SETS_PATH));
        return sets[set_id];
    } catch (error) {
        throw new Error("Failed to load set", {cause: error});
    }
}

module.exports = setLoader;
