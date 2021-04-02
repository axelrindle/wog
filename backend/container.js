// Require modules
const EventEmitter = require('events');
const awilix = require('awilix');
const debug = require('debug')('wog:container');
const pkg = require('../package.json');

/**
 * Registers essential services to the container.
 *
 * @param {import('awilix').AwilixContainer} container
 */
const registerInitServices = async (container) => {
  container.register('events', awilix.asValue( new EventEmitter() ));

  const config = await require('./init/config')();
  container.register('config', awilix.asValue(config));
  debug('Registered static configuration.');

  container.register('logger', awilix.asFunction( require('./init/logger') ).singleton());
  debug('Registered the logger.');

  container.register('storage', awilix.asClass( require('./init/storage') ));
  debug('Registered storage service.');

  container.register('database', awilix.asClass( require('./init/database') ).singleton());
  debug('Registered database service.');

  container.register('accounts', awilix.asClass( require('./init/accounts') ).singleton());
  debug('Registered account service.');

  container.register('mailer', awilix.asClass( require('./init/mailer') ).singleton());
  debug('Registered mail service.');

  container.register('redis', awilix.asClass( require('./init/redis') ).singleton());
  debug('Registered redis service.');

  await container.resolve('storage').createDirectory();
  await container.resolve('database').init();
  await container.resolve('accounts').init();
  await container.resolve('mailer').init();
  await container.resolve('redis').init();
  debug('Services initialized.');
};

/**
 * Registers any loaded packages to the service container.
 *
 * @param {import('awilix').AwilixContainer} container
 * @param {import('@wogjs/types').Logger} logger
 */
const registerPackages = async (container, logger) => {
  const packages = container.resolve('packages');

  const adapters = packages.findByType('adapter');
  try {
    for (const adapter of adapters) {
      const initializer = require(adapter.main);
      initializer(awilix, container);
    }
  } catch (error) {
    logger.error('An error occured while initializing a package!');
    logger.error(error);
  }
};

module.exports = async () => {

  // Create service container
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY
  });

  container.register('wogVersion', awilix.asValue(pkg.version));
  container.register('nodeVersion', awilix.asValue(pkg.engines.node));
  debug('Registered environment information.');

  await registerInitServices(container);

  const logger = container.resolve('logger').scope('container');

  container.register('packages', awilix.asClass( require('./init/packages') ).singleton());
  container.resolve('packages').init();
  await registerPackages(container, logger);
  debug('Registered packages.');

  return container;
};
