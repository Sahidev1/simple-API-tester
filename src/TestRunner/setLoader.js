
const fs = require('fs');
const path = require('path');

const SETS_PATH = path.join(__dirname, '../../data/sets.json');
/**
 * Loads a test set from a JSON file.
 * @param {string} set_id - The ID of the set to load.
 * @returns {object} - The loaded set object.
 * @throws {Error} - If there is an error loading the set.
 */
function setLoader(set_id){
    try {
        let sets = JSON.parse(fs.readFileSync(SETS_PATH));
        return sets[set_id];
    } catch (error) {
        throw new Error("Failed to load set", {cause: error});
    }
}

module.exports = setLoader;
