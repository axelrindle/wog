// Require modules
const WritableStream = require('stream').Writable;
const morgan = require('morgan');
const env = require('@wogjs/utils/lib/env');

class PipeStream extends WritableStream {

  /**
   * @param {import('@wogjs/types').Logger} logger
   */
  constructor(logger) {
    super();

    /** @type {import('@wogjs/types').Logger} */
    this._logger = logger;
  }

  /**
   * @param {any} chunk
   * @param {BufferEncoding} encoding
   * @param {(error?: Error | null) => void} callback
   */
  _write (chunk, encoding, callback) {
    // trim ending newline
    if (chunk) {
      chunk = chunk.toString();
    }
    if (typeof chunk === 'string' && chunk.endsWith('\n')) {
      chunk = chunk.replace(/\n$/, '');
    }

    this._logger.info(chunk);
    callback();
  }

}

/**
 * @param {Object} config
 * @param {import('@wogjs/types').Logger} logger
 */
module.exports = (config, logger) => {
  return morgan(config.logging.http.format, {
    stream: new PipeStream(logger)
  });
};
