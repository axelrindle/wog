// Require modules
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const semverSatisfies = require('semver/functions/satisfies')
const debug = require('debug')('wog:packages');

const VALID_TYPES = ['adapter'];

/** @type {import('@wogjs/types').PackageRegistry} */
module.exports = class PackageRegistry {

  constructor({ wogVersion, logger }) {
    /** @type {string} */
    this._wogVersion = wogVersion;
    this._rootDirectory = path.join(ROOT_DIRECTORY, 'packages');

    this._logger = logger.scope('packages');

    this._registry = [];
    this._loadedPackages = 0;
  }

  _scan() {
    debug('Scanning "' + this._rootDirectory + '"...');

    const pattern = path.join(this._rootDirectory, '**/wog.package.json');
    this._foundDirectories = glob.sync(pattern)
      .map(el => path.dirname(el)) // get directory name
      .map(el => el.replace(this._rootDirectory + '/', ''));
  }

  _load() {
    for (const pkg of this._foundDirectories) {
      try {
        debug('Processing "' + pkg + '"...');

        // package.json needed
        const pkgDir = path.join(this._rootDirectory, pkg);
        const pkgFile = path.join(pkgDir, 'package.json');
        if (!fs.existsSync(pkgFile)) {
          throw new Error('File "package.json" not found in "' + pkgDir + '"!');
        }
        debug('package.json found in ' + pkg);
        const pkgNode = require(pkgFile);

        // validate wog.package.json info
        const pkgWog = require(path.join(pkgDir, 'wog.package.json'));
        if (!VALID_TYPES.includes(pkgWog.type)) {
          throw new Error('Can\'t load package because of it\'s invalid type: "' + pkgWog.type + '"!');
        }
        if(!semverSatisfies(this._wogVersion, pkgWog.wog)) {
          throw new Error('Package requirement "' + pkgWog.wog + '" does not satisfy wog version "' + this._wogVersion + '"!');
        }
        debug('wog.package.json is valid in ' + pkg);

        // enforce unique ids
        if (this.findById(pkg) !== null) {
          throw new Error('A package with the ID "' + pkg + '" has already been registered!');
        }

        // pkg seems valid, register it
        this._registry.push({
          id: pkg,
          type: pkgWog.type,
          version: pkgNode.version,
          description: pkgNode.description || "No description provided.",
          displayName: pkgWog.displayName,
          main: path.resolve(pkgDir, pkgNode.main)
        });
        this._loadedPackages++;
        debug('Package "' + pkg + '" has been registered.');

      } catch (error) {
        this._logger.error('An error occured while loading package "' + pkg + '":');
        this._logger.error(error);
        continue;
      }
    }
  }

  init() {
    this._logger.info('Loading packages...');
    this._scan();
    this._load();
    this._logger.info('Loaded ' + this._loadedPackages + ' package(s).');
  }

  count() {
    return this._loadedPackages;
  }

  findByType(type) {
    if (!VALID_TYPES.includes(type)) {
      throw new Error('Illegal type "' + type + '"!');
    }
    return this._registry.filter(el => el.type === type);
  }

  findById(id) {
    for (const pkg of this._registry) {
      if (pkg.id === id) {
        return pkg;
      }
    }

    return null;
  }

};

module.exports.VALID_TYPES = VALID_TYPES;
