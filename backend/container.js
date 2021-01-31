// Require modules
const awilix = require('awilix');
const debug = require('debug')('wog:container');

const services = [
  'storage',
  'config',
  'logger',
  'database',
  'adapters',
  'accounts',
  'mailer',
  'redis'
];

module.exports = async () => {

  // Create service container
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY
  });

  container.register('util', awilix.asValue( require('./util') ));

  container.register('storage', awilix.asClass( require('./init/storage') ));
  container.resolve('storage').createDirectory();

  const config = await require('./init/config')(container);
  container.register('config', awilix.asValue(config));

  container.register('logger', awilix.asFunction( require('./init/logger') ).singleton());

  container.register('database', awilix.asClass( require('./init/database') ).singleton());
  await container.resolve('database').init();

  // container.register('adapters', awilix.asClass( require('./init/adapter-manager') ).singleton());
  // await container.resolve('adapters').init();

  container.register('accounts', awilix.asClass( require('./init/accounts') ).singleton());
  await container.resolve('accounts').init();

  container.register('mailer', awilix.asClass( require('./init/mailer') ).singleton());
  await container.resolve('mailer').init();

  container.register('redis', awilix.asClass( require('./init/redis') ).singleton());
  await container.resolve('redis').init();

  return container;
};
