// Locals used in the templates
module.exports = app => {
  app.locals = {
    url: config.app.url,
    _debug: DEBUG,

    path: path => {
      let url = config.app.url;
      if (!url.endsWith('/'))
        url += '/';

      if (path.startsWith('/'))
        path = path.substring(1);

      return url + path;
    }
  };
};
