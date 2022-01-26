import mongoose from "mongoose";
import { NODE_ENV } from "./constants";
import { dbConnection as db } from "./database/database";
import loggerFunction from "./utils/genericLogger";
const logger = loggerFunction(__filename);

class Database {
	public conn: mongoose.Connection;
	public reconnectTimeout = 5000;

	constructor() {
		this.conn = mongoose.connection;

		if (NODE_ENV === "development") {
			// logs to winston (or console if not using winston) every time a query is made on this connection
			mongoose.set("debug", true);
		}
	}

	// public async connect(): Promise<void> {
	// 	await mongoose.connect(db.url, db.options);
	// }

	public async connect(): Promise<mongoose.Connection> {
		const conn = mongoose.createConnection(db.url, db.options);
		this.conn = conn;

		// when we see the connected event https://mongoosejs.com/docs/connections.html#connection-events
		conn.on("connected", () => {
			// we can get the mongo driver using this method to get a bunch of useful lower level methods
			logger.info(`connected to database: ${conn.getClient().isConnected()}`);
		});

		// when we see the connected event https://mongoosejs.com/docs/connections.html#connection-events
		conn.on("connecting", () => {
			// we can get the mongo driver using this method to get a bunch of useful lower level methods
			logger.info(`connecting to the database`);
		});

		// when we lose connection to the database
		conn.on("disconnected", () => {
			logger.info(`Disconnected from database`);
		});

		// when there is an error (will emit if conn rejects)
		conn.on("error", () => {
			logger.error(`An error occured`);
		});

		return conn;
	}

	public async disconnect(): Promise<void> {
		// this will close EVERYTHING (all connections to all databases)
		// this.conn.close() does not close ALL connections. There is a passive default
		//     mongoose.connections[0] that is not the connection this database is working with (mongoose.connections[1])
		//     so calling this.conn.close() would only close mongoose.connections[1] and not the [0] index.
		await mongoose.disconnect();
		logger.info("connection to database closed");
	}
}

export default Database;
