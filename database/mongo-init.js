/* eslint no-undef: 0 */

print("============================================================================");
print("==================== RUNNING MONGO INIT-MONGO.JS SCRIPT ====================");
print("============================================================================");

db.getSiblingDB("blogwatcher").createUser({
	user: "blogwatcher",
	pwd: "rhinos",
	roles: [
		{
			role: "dbOwner",
			db: "blogwatcher",
		},
	],
});

// const databases = ["blogwatcher", "test"];

// for (let i = databases.length - 1; i >= 0; i--) {
// 	db = db.getSiblingDB(databases[i]);

// 	db.createUser({
// 		user: "roland",
// 		pwd: "rhinos",
// 		roles: ["readWrite"],
// 	});
// }

// Connecting as admin.
// mongo "mongodb://admin:rhinos@localhost:27017/admin?authSource=admin"

// Connecting as user.
// mongo "mongodb://roland:rhinos@localhost:27017/blogwatcher?authSource=blogwatcher"
