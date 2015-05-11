// The MIT License (MIT)

// Copyright (c) 2015 Elliott Richerson, Carlos Aari Lotfipour

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in 
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

module.exports = function Database(configuration) {
	var neo4j = require('neo4j');

	neo4j.GraphDatabase.prototype.util = {
		setDB: function(database) {
			this.dbx = database;
		},
		cypher: function(input) {
			// console.log("----------------------");
			// console.log("EXECUTING CYPHER QUERY");
			// console.log(input);
			// console.log("----------------------");
			return function(callback) {
				this.cypher(input, callback);
			}.bind(this.dbx);
		},
		json_response: function(data, errors) {
			var obj = {};
			if(data) { obj.data = data; }
			if(errors) { obj.errors = errors; }
			return JSON.stringify(obj, null, 4);
		},
		object_response: function(data, errors) {
			var obj = {};
			if(data) { obj.data = data; }
			if(errors) { obj.errors = errors; }
			return obj;
		},
		/* Admin Cypher Queries */
		admin_return: function(alias) {
			return " id("+alias+") AS id, "+ 
				alias+".username AS username, "+ 
				alias+".firstname AS firstname, "+
				alias+".lastname AS lastname, "+
				alias+".email AS email, "+
				alias+".birthday AS birthday, "+
				alias+".phone AS phone, "+
				alias+".created_on AS created_on, "+
				alias+".updated_on AS updated_on, "+
				alias+".login_on AS login_on";
		},
		admin_login_return: function(alias) {
			return " id("+alias+") AS id, "+ 
				alias+".username AS username, "+ 
				alias+".firstname AS firstname, "+
				alias+".lastname AS lastname, "+
				alias+".email AS email, "+
				alias+".birthday AS birthday, "+
				alias+".phone AS phone, "+
				alias+".created_on AS created_on, "+
				alias+".updated_on AS updated_on, "+
				alias+".login_on AS login_on, "+
				alias+".hash AS hash";
		},
		admin_create: function(admin) {
			var query = "CREATE (a:Admin {admin}) " +
						" RETURN " + this.admin_return("a");
			var params = { admin: admin };
			return this.cypher({query: query, params: params});
		},
		admin_update: function(admin, id) {
			var query = "MATCH (a:Admin) WHERE id(a) = " + id + " SET a += { admin }";
			var params = { admin: admin };
			return this.cypher({query: query, params: params});
		},
		admin_by_id: function(id) {
			var query = "MATCH (a:Admin) WHERE id(a) = " + id + 
						" RETURN " + this.admin_return("a");
			return this.cypher(query);
		},
		admin_by_username: function(username) {
			var query = "MATCH (a:Admin) WHERE a.username = \"" + username + 
						"\" RETURN " + this.admin_return("a");
			return this.cypher(query);
		},
		admin_by_username_for_login: function(username) {
			var query = "MATCH (a:Admin) WHERE a.username = \"" + username + 
						"\" RETURN " + this.admin_login_return("a");
			return this.cypher(query);
		},
		admin_by_email: function(email) {
			var query = "MATCH (a:Admin) WHERE a.email = \"" + email + 
						"\" RETURN " + this.admin_return("a");
			return this.cypher(query);
		},
		admin_by_email_for_login: function(email) {
			var query = "MATCH (a:Admin) WHERE a.email = \"" + email + 
						"\" RETURN " + this.admin_login_return("a");
			return this.cypher(query);
		},
		admins_all: function() {
			var query = "MATCH (a:Admin)" +
						" RETURN " + this.admin_return("a");
			return this.cypher(query);
		},
		admin_delete_by_username: function(username) {
			var query = "MATCH (a:Admin) WHERE a.username = \"" + username + 
						"\" DELETE a";
			return this.cypher(query);
		},
		admin_delete_by_email: function(email) {
			var query = "MATCH (a:Admin) WHERE a.email = \"" + email + 
						"\" DELETE a";
			return this.cypher(query);
		},
		admins_purge: function() {
			var query = "MATCH (a:Admin) DELETE a";
		},
		/* User Cypher Queries */
		user_return: function(alias) {
			return " id("+alias+") AS id, "+ 
				alias+".username AS username, "+ 
				alias+".firstname AS firstname, "+
				alias+".lastname AS lastname, "+
				alias+".email AS email, "+
				alias+".birthday AS birthday, "+
				alias+".phone AS phone, "+
				alias+".created_on AS created_on, "+
				alias+".updated_on AS updated_on, "+
				alias+".login_on AS login_on";
		},
		user_login_return: function(alias) {
			return " id("+alias+") AS id, "+ 
				alias+".username AS username, "+ 
				alias+".firstname AS firstname, "+
				alias+".lastname AS lastname, "+
				alias+".email AS email, "+
				alias+".birthday AS birthday, "+
				alias+".phone AS phone, "+
				alias+".created_on AS created_on, "+
				alias+".updated_on AS updated_on, "+
				alias+".login_on AS login_on, "+
				alias+".hash AS hash";
		},
		user_create: function(user) {
			var query = "CREATE (u:User {user}) " +
						" RETURN " + this.user_return("u");
			var params = { user: user };
			return this.cypher({query: query, params: params});
		},
		user_update: function(user, id) {
			var query = "MATCH (u:User) WHERE id(u) SET u += { user }";
			var params = { user: user };
			return this.cypher({query: query, params: params});
		},
		user_by_id: function(id) {
			var query = "MATCH (u:User) WHERE id(u) = " + id + 
						" RETURN " + this.user_return("u");
			return this.cypher(query);
		},
		user_by_username: function(username) {
			var query = "MATCH (u:User) WHERE u.username = \"" + username + 
						"\" RETURN " + this.user_return("u");
			return this.cypher(query);
		},
		user_by_username_for_login: function(username) {
			var query = "MATCH (u:User) WHERE u.username = \"" + username + 
						"\" RETURN " + this.user_login_return("u");
			return this.cypher(query);
		},
		user_by_email: function(email) {
			var query = "MATCH (u:User) WHERE u.email = \"" + email + 
						"\" RETURN " + this.user_return("u");
			return this.cypher(query);
		},
		user_by_email_for_login: function(email) {
			var query = "MATCH (u:User) WHERE u.email = \"" + email + 
						"\" RETURN " + this.user_login_return("u");
			return this.cypher(query);
		},
		users_all: function() {
			var query = "MATCH (u:User)" +
						" RETURN " + this.user_return("u");
			return this.cypher(query);
		},
		users_purge: function() {
			var query = "MATCH (u:User) DELETE u";
		},
		/* Geocache Cypher Queries */
		geocache_return: function(alias) {
			return " id("+alias+") AS id, "+ 
				alias+".title AS title, "+ 
				alias+".message AS message, "+
				alias+".lat AS lat, "+
				alias+".lng AS lng, "+
				alias+".currency AS currency, "+
				alias+".amount AS amount, "+
				alias+".is_physical AS is_physical, "+
				alias+".delay AS delay, "+
				alias+".drop_count AS drop_count, "+
				alias+".dropped_on AS dropped_on";
		},
		geocache_create: function(geocache) {
			var query = "CREATE (g:Geocache {geocache}) " +
						" RETURN " + this.geocache_return("g");
			var params = { geocache: geocache };
			return this.cypher({query: query, params: params});
		},
		geocache_update: function(geocache, id) {
			var query = "MATCH (g:Geocache) WHERE id(g) SET g += { geocache }";
			var params = { geocache: geocache };
			return this.cypher({query: query, params: params});
		},
		geocache_by_id: function(id) {
			var query = "MATCH (g:Geocache) WHERE id(g) = " + id + 
						" RETURN " + this.geocache_return("g");
			return this.cypher(query);
		},
		geocaches_all: function() {
			var query = "MATCH (g:Geocache)" +
						" RETURN " + this.geocache_return("g");
			return this.cypher(query);
		},
		geocaches_purge: function() {
			var query = "MATCH (g:Geocache) DELETE g";
		}
	};

	function GraphDatabaseExtension(configuration){
		neo4j.GraphDatabase.call(this, configuration);
	};
	GraphDatabaseExtension.prototype = Object.create(neo4j.GraphDatabase.prototype);
	GraphDatabaseExtension.prototype.constructor = GraphDatabaseExtension;

	// var db = new neo4j.GraphDatabase(configuration);
	var db = new GraphDatabaseExtension(configuration);
	db.util.setDB(db);
	return db;
};