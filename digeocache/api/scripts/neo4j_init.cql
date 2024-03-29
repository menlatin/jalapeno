// Create Admin Indices and Constraints
CREATE CONSTRAINT ON (a:Admin) ASSERT a.username IS UNIQUE;
CREATE CONSTRAINT ON (a:Admin) ASSERT a.email IS UNIQUE;

// Create User Indices and Constraints
CREATE CONSTRAINT ON (u:User) ASSERT u.username IS UNIQUE;
CREATE CONSTRAINT ON (u:User) ASSERT u.email IS UNIQUE;

// Create Geocache Indices for Better Location Search Performance
CREATE INDEX ON :Geocache(lat);
CREATE INDEX ON :Geocache(lon);

// Wipe Out Database
START n = node(*) 
OPTIONAL MATCH n-[r]-() 
WHERE (ID(n)>0 AND ID(n)<10000) 
DELETE n, r;

START n = node(*) 
OPTIONAL MATCH n-[r]-() 
WHERE (ID(n)>0 AND ID(n)<20000) 
DELETE n, r;

START n = node(*) 
OPTIONAL MATCH n-[r]-() 
WHERE (ID(n)>0 AND ID(n)<30000) 
DELETE n, r;

// Create Admins
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:/Users/elliott/code/git/jalapeno/digeocache/api/scripts/csv/admin.csv" AS row
CREATE (:Admin {
	username: row.username, 
	firstname: row.firstname, 
	lastname: row.lastname, 
	email: row.email,
	birthday: row.birthday,
	phone: row.phone,
	created_on: row.created_on,
	updated_on: row.updated_on,
	login_on: row.login_on,
	hash: row.hash
});

// Create Users
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:/Users/elliott/code/git/jalapeno/digeocache/api/scripts/csv/user.csv" AS row
CREATE (:User {
	username: row.username, 
	firstname: row.firstname, 
	lastname: row.lastname, 
	email: row.email,
	birthday: row.birthday,
	phone: row.phone,
	created_on: row.created_on,
	updated_on: row.updated_on,
	login_on: row.login_on,
	hash: row.hash
});

// Create Geocaches
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:/Users/elliott/code/git/jalapeno/digeocache/api/scripts/csv/geocache.csv" AS row
CREATE (:Geocache {
	title: row.title, 
	message: row.message, 
	lat: row.lat, 
	lng: row.lng,
	currency: row.currency,
	amount: row.amount,
	is_physical: row.is_physical,
	delay: row.delay,
	drop_count: row.drop_count,
	dropped_on: row.dropped_on
});

// Create Comments
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:/Users/elliott/code/git/jalapeno/digeocache/api/scripts/csv/comment.csv" AS row
CREATE (:Comment {
	text: row.text,
	created_on: row.created_on,
	updated_on: row.updated_on
});

// Create Wallets
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:/Users/elliott/code/git/jalapeno/digeocache/api/scripts/csv/wallet.csv" AS row
CREATE (:Wallet {
	name: row.name,
	created_on: row.created_on,
	updated_on: row.updated_on
});

// Create Currencies
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:/Users/elliott/code/git/jalapeno/digeocache/api/scripts/csv/currency.csv" AS row
CREATE (:Currency {
	abbreviation: row.abbreviation,
	name: row.name,
	site: row.site
});
