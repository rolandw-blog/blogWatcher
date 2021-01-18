/* eslint no-undef: 0 */

print("============================================================================")
print("==================== RUNNING MONGO INIT-MONGO.JS SCRIPT ====================")
print("============================================================================")

const databases = ["blogWatcher", "test"]

for (let i = databases.length - 1; i >= 0; i--) {
	db = db.getSiblingDB(databases[i])

	db.createUser({
		user: "roland",
		pwd: "rhinos",
		roles: ["readWrite"]
	})
}

// Connecting as admin. replace "password" and "1.2.3.4"
// mongo "mongodb://admin:password@1.2.3.4:27017/admin?authSource=admin"

// Connecting as user. Change the user login details using admin account first
// mongo "mongodb://roland:rhinos@1.2.3.4:27017/blogWatcher?authSource=blogWatcher"