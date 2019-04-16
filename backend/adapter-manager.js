/**
 * The AdapterManager holds all configured adapters and is used
 * to retrieve information from the active (selected) adapter.
 */
class AdapterManager {
  constructor() {
    this.instances = {};
    this.selected = -1;

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

  select(index) {
    if (index < 0) throw new Exception('The index must be greater than or equal to 0!');
    this.selected = index;
  }

  /**
   * Returns the currently selected adapter instance.
   *
   * @return {BaseAdapter|null} The active adapter.
   */
  get theAdapter() {
    return this.selected === -1 ? null : this.instances[this.selected];
  }
}

global.adapters = new AdapterManager();
