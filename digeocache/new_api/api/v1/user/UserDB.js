module.exports = function UserDB() {
    var userDB = {
        /* User Cypher Queries */
        user_return: function(alias) {
            return " id(" + alias + ") AS id, " +
                alias + ".username AS username, " +
                alias + ".firstname AS firstname, " +
                alias + ".lastname AS lastname, " +
                alias + ".email AS email, " +
                alias + ".birthday AS birthday, " +
                alias + ".phone AS phone, " +
                alias + ".created_on AS created_on, " +
                alias + ".updated_on AS updated_on, " +
                alias + ".login_on AS login_on";
        },
        user_login_return: function(alias) {
        	console.log("THIS SHOULDNT BE CALLED HERE");
            return " id(" + alias + ") AS id, " +
                alias + ".username AS username, " +
                alias + ".firstname AS firstname, " +
                alias + ".lastname AS lastname, " +
                alias + ".email AS email, " +
                alias + ".birthday AS birthday, " +
                alias + ".phone AS phone, " +
                alias + ".created_on AS created_on, " +
                alias + ".updated_on AS updated_on, " +
                alias + ".login_on AS login_on, " +
                alias + ".hash AS hash";
        },
        user_create: function(user) {
            var query = "CREATE (u:User {user}) " +
                " RETURN " + this.user_return("u");
            var params = {
                user: user
            };
            return this.cypher({
                    query: query,
                    params: params
                })
                .then(this.successOneOrNone, this.error);
        },
        user_update: function(user, id) {
            var query = "MATCH (u:User) WHERE id(u) = " + id + " SET u += { user } " +
                " RETURN " + this.user_return("u");
            var params = {
                user: user
            };
            return this.cypher({
                    query: query,
                    params: params
                })
                .then(this.successOneOrNone, this.error);
        },
        user_by_id: function(id) {
            var query = "MATCH (u:User) WHERE id(u) = " + id +
                " RETURN " + this.user_return("u");
            return this.cypher(query)
                .then(this.successOneOrNone, this.error);
        },
        user_by_username: function(username) {
            var query = "MATCH (u:User) WHERE u.username = \"" + username +
                "\" RETURN " + this.user_return("u");
            return this.cypher(query)
                .then(this.successOneOrNone, this.error);
        },
        user_by_username_for_login: function(username) {
            var query = "MATCH (u:User) WHERE u.username = \"" + username +
                "\" RETURN " + this.user_login_return("u");
            return this.cypher(query)
                .then(this.successOneOrNone, this.error);
        },
        user_by_email: function(email) {
            var query = "MATCH (u:User) WHERE u.email = \"" + email +
                "\" RETURN " + this.user_return("u");
            return this.cypher(query)
                .then(this.successOneOrNone, this.error);
        },
        user_by_email_for_login: function(email) {
            var query = "MATCH (u:User) WHERE u.email = \"" + email +
                "\" RETURN " + this.user_login_return("u");
            return this.cypher(query)
                .then(this.successOneOrNone, this.error);
        },
        users_all: function() {
            var query = "MATCH (u:User)" +
                " RETURN " + this.user_return("u");
            return this.cypher(query)
                .then(this.success, this.error);
        },
        user_delete_by_id: function(id) {
        	var query = "MATCH (u:User) WHERE id(u) = " + id + " OPTIONAL MATCH (u)-[r]-() DELETE u, r";
        	return this.cypher(query)
        		.then(this.successDelete, this.error);
        },
        user_delete_by_username: function(username) {
            var query = "MATCH (u:User { username: \"" + username + "\" }) OPTIONAL MATCH (u)-[r]-() DELETE u, r";
            return this.cypher(query)
                .then(this.successDelete, this.error);
        },
        user_delete_by_email: function(email) {
            var query = "MATCH (u:User { email: \"" + email + "\" }) OPTIONAL MATCH (u)-[r]-() DELETE u, r";
            return this.cypher(query)
                .then(this.successDelete, this.error);
        },
        users_purge: function() {
            var query = "MATCH (u:User) DELETE u";
            //TODO
        },
        user_username_taken: function(username) {
            var query = "MATCH (u:User) WHERE u.username = \"" + username +
                "\" RETURN " + this.user_return("u");
            return this.cypher(query)
                .then(this.successTaken, this.error);
        },
        user_email_taken: function(email) {
            var query = "MATCH (u:User) WHERE u.email = \"" + email +
                "\" RETURN " + this.user_return("u");
            return this.cypher(query)
                .then(this.successTaken, this.error);
        }
    };
    return userDB;
}