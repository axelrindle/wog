// Require modules
const fs = require('fs');
const path = require('path');
const asyncForEach = require('@axelrindle/async-for-each');
const isDirectory = require('is-directory');

/**
 * The AdapterManager holds all configured adapters and is used
 * to retrieve information from the active (selected) adapter.
 */
class AdapterManager {
  constructor() {
    this.logger = logger.scope('adapter-manager');
    this.adapters = this.available();
    this.instances = {};
  }

  /**
   * Loads available adapters (built-in and packages).
   */
  available() {
    const builtInDir = path.resolve(__dirname, '..', 'adapter');
    const packagesDir = path.resolve(ROOT_DIRECTORY, 'packages');
    const builtIn = fs.readdirSync(builtInDir);
    const packages = isDirectory.sync(packagesDir) ? fs.readdirSync(packagesDir) : [];
    const result = {};

    builtIn.forEach(el => {
      const name = path.basename(el, '.js').toLowerCase().replace('adapter', '');
      if (name === 'base') return; // skip BaseAdapter
      result[name] = path.join(builtInDir, el);
    });
    packages.forEach(el => {
      const pkg = require(path.join(packagesDir, el, 'package.json'));
      if (typeof pkg['wog-package'] === 'object' && pkg['wog-package'].type === 'adapter') {
        result[pkg['wog-package'].registryName] = path.join(packagesDir, el, pkg.main);
      }
    });
    if (DEBUG) {
      this.logger.debug(`Loaded ${Object.keys(result).length} adapters: `);
      this.logger.debug('\n' + JSON.stringify(result, null, 2));
    }

    return result;
  }

  async init() {
    // Load configured adapters
    const options = config.adapters.options;
    const enabled = config.adapters.enabled.split(',');

    // Create class instances for every enabled adapter
    await asyncForEach(enabled, async (el) => {
      // the path to the file is configured (alias/module/etc.)
      // we can just require it
      // and create a class instance with the given options
      const toLoad = this.adapters[el];
      if (!toLoad) {
        this.logger.warn(`No adapter found with name ${el}!`);
        return;
      }

      const clazz = require(toLoad);
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
    Object.keys(this.instances).forEach(el => {
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

// Export class instance
module.exports = new AdapterManager();
