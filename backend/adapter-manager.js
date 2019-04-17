/**
 * The AdapterManager holds all configured adapters and is used
 * to retrieve information from the active (selected) adapter.
 */
class AdapterManager {
  constructor() {
    this.instances = {};
    this.init();
  }

  init() {
    // Load configured adapters
    const available = config.adapters.available;
    const options = config.adapters.options;
    this.enabled = config.adapters.enabled.split(',');

    // Create class instances for every enabled adapter
    this.enabled.forEach(el => {
      // the path to the file is configured (alias/module/etc.)
      // we can just require it
      // and create a class instance with the given options
      const clazz = require(available[el]);
      this.instances[el] = new clazz(options[el]);
    });
  }

  dispose() {
    objectKeyLoop(this.instances, el => {
      this.instances[el].dispose();
    });
    this.instances = null;
  }

  list() {
    return this.enabled;
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
