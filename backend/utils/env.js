/**
 * Retrieve a value from the environment.
 */
module.exports = {

    /**
     * Generic retriever for environment variables.
     *
     * @param {string} key The environment key to retrieve.
     * @param {any} def A default value.
     * @param {Function} validate A validation function that consumes the raw value from the environment.
     * @returns {string|any|undefined} The retrieved value, the default value or `undefined` (in this order).
     */
    get(key, def, validate) {
        const value = process.env[key];
        return validate(value) ? value : def;
    },

    /**
     * Retrieves a text value from the environment.
     *
     * @param {string} key The environment key to retrieve.
     * @param {any} def A default value.
     * @returns {string|any|undefined} The retrieved value, the default value or `undefined` (in this order).
     */
    text(key, def = undefined) {
        return this.get(key, def, value => typeof value === 'string');
    },

    /**
     * Retrieves an int value from the environment.
     *
     * @param {string} key The environment key to retrieve.
     * @param {any} def A default value.
     * @param {number} min The minimum number to allow.
     * @returns {Number|any|undefined} The retrieved value, the default value or `undefined` (in this order).
     */
    int(key, def = undefined, min = undefined) {
        const value = this.get(key, def, value => parseInt(value));
        if (min !== undefined) {
            return value >= min ? value : min;
        } else {
            return value;
        }
    },

    /**
     * Retrieves a boolean value from the environment.
     *
     * @param {string} key The environment key to retrieve.
     * @param {any} def A default value.
     * @returns {boolean|any|undefined} The retrieved value, the default value or `undefined` (in this order).
     */
    bool(key, def = undefined) {
        const result = this.get(key, def, value => {
            if (!value) return false;
            else return ['true', 'false'].includes(value.toLowerCase());
        });
        return result ? (result === 'true') : def;
    }
	
};
