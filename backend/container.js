// Require modules
const awilix = require('awilix');
const debug = require('debug')('wog:container');
const pkg = require('../package.json');

/**
 * Registers essential services to the container.
 *
 * @param {AwilixContainer} container
 */
const registerInitServices = async (container) => {
  container.register('storage', awilix.asClass( require('./init/storage') ));
  container.resolve('storage').createDirectory();
  debug('Registered storage service.');

  const config = await require('./init/config')(container);
  container.register('config', awilix.asValue(config));
  debug('Registered static configuration.');

  container.register('logger', awilix.asFunction( require('./init/logger') ).singleton());
  debug('Registered the logger.');

  container.register('database', awilix.asClass( require('./init/database') ).singleton());
  await container.resolve('database').init();
  debug('Registered database service.');

  container.register('accounts', awilix.asClass( require('./init/accounts') ).singleton());
  await container.resolve('accounts').init();
  debug('Registered account service.');

  container.register('mailer', awilix.asClass( require('./init/mailer') ).singleton());
  await container.resolve('mailer').init();
  debug('Registered mail service.');

  container.register('redis', awilix.asClass( require('./init/redis') ).singleton());
  await container.resolve('redis').init();
  debug('Registered redis service.');
};

/**
 * Registers any loaded packages to the service container.
 *
 * @param {AwilixContainer} container
 */
const registerPackages = async (container) => {
  const packages = container.resolve('packages');

  const foundationPackages = packages.findByType('foundation');
  for (const foundation of foundationPackages) {
    const initializer = require(foundation.id);
    initializer(awilix, container);
  }

  const adapters = packages.findByType('adapter');
  for (const adapter of adapters) {
    const initializer = require(adapter.id);
    initializer(awilix, container);
  }
};

module.exports = async () => {

  // Create service container
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY
  });

  container.register('wogVersion', awilix.asValue(pkg.version));
  container.register('nodeVersion', awilix.asValue(pkg.engines.node));
  debug('Registered environment information.')

  container.register('util', awilix.asValue( require('./util') ));
  debug('Registered utilites.');

  await registerInitServices(container);

  container.register('packages', awilix.asClass( require('./init/packages') ).singleton());
  container.resolve('packages').init();
  await registerPackages(container);
  debug('Registered packages.');

  return container;
};
