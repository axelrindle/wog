// Locals used in the templates
module.exports = config => ({
  url: config.url,
  debug: config.debug,

  path: path => {
    let url = config.url;
    if (!url.endsWith('/'))
      url += '/';

    if (path.startsWith('/'))
      path = path.substring(1);

    return url + path;
  }
});
