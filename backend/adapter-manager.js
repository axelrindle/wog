// https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

/**
 * The AdapterManager holds all configured adapters and is used
 * to retrieve information from the active (selected) adapter.
 */
class AdapterManager {
  constructor() {
    this.instances = {};
  }

  async init() {
    // Load configured adapters
    const available = config.adapters.available;
    const options = config.adapters.options;
    const enabled = config.adapters.enabled.split(',');

    // Create class instances for every enabled adapter
    await asyncForEach(enabled, async (el) => {
      // the path to the file is configured (alias/module/etc.)
      // we can just require it
      // and create a class instance with the given options
      const clazz = require(available[el]);
      const instance = new clazz(options[el]);
      try {
        await instance.init();
        this.instances[el] = instance;
      } catch (e) {
        instance.logger.error(e);
      }
    });
  }

  dispose() {
    objectKeyLoop(this.instances, el => {
      this.instances[el].dispose();
    });
    this.instances = null;
  }

  list() {
    return Object.keys(this.instances);
  }

  /**
   * Returns the currently selected adapter instance.
   *
   * @param string key The adapter to select.
   * @return {BaseAdapter|null} The selected adapter.
   */
  getAdapter(key) {
    return this.instances[key];
  }
}

global.adapters = new AdapterManager();
