/**
 * Indicates whether the process is running in debug mode.
 */
module.exports = (() => {
	if (process.env.NODE_ENV === 'debug') return true;
	if (typeof process.env.DEBUG === 'string' && process.env.DEBUG.includes('wog')) return true;

	return false;
})();
