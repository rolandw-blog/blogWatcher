/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */

import genericLogger from "./genericLogger";

// ##──── STREAM LOGGER ─────────────────────────────────────────────────────────────────────

// This is an object that can be called through other middleware,
// 	for example morgan can call the stream.write function to write its logs INTO winston
const streamLogger = {
	write: (message: string): void => {
		genericLogger.info(message.substring(0, message.lastIndexOf("\n")));
	},
};

export default streamLogger;
