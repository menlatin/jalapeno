module.exports = function GeocacheDB() {
    var geocacheDB = {
        /* Geocache Cypher Queries */
        geocache_return: function(alias) {
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
        geocache_create: function(geocache) {
            var query = "CREATE (g:Geocache {geocache}) " +
                " RETURN " + this.geocache_return("g");
            var params = {
                geocache: geocache
            };
            return this.cypher({
                    query: query,
                    params: params
                })
                .then(this.successOneOrNone, this.error);
        },
        geocache_update: function(geocache, id) {
            var query = "MATCH (g:Geocache) WHERE id(g) = " + id + " SET g += { geocache } " +
                " RETURN " + this.geocache_return("g");
            var params = {
                geocache: geocache
            };
            return this.cypher({
                    query: query,
                    params: params
                })
                .then(this.successOneOrNone, this.error);
        },
        geocache_by_id: function(id) {
            var query = "MATCH (g:Geocache) WHERE id(g) = " + id +
                " RETURN " + this.geocache_return("g");
            return this.cypher(query)
                .then(this.successOneOrNone, this.error);
        },
        geocache_by_username: function(username) {
            var query = "MATCH (g:Geocache) WHERE g.username = \"" + username +
                "\" RETURN " + this.geocache_return("g");
            return this.cypher(query)
                .then(this.successOneOrNone, this.error);
        },
        geocache_by_email: function(email) {
            var query = "MATCH (g:Geocache) WHERE g.email = \"" + email +
                "\" RETURN " + this.geocache_return("g");
            return this.cypher(query)
                .then(this.successOneOrNone, this.error);
        },
        geocaches_all: function() {
            var query = "MATCH (g:Geocache)" +
                " RETURN " + this.geocache_return("g");
            return this.cypher(query)
                .then(this.success, this.error);
        },
        geocache_delete_by_id: function(id) {
            var query = "MATCH (g:Geocache) WHERE id(g) = " + id + " OPTIONAL MATCH (g)-[r]-() DELETE g, r";
            return this.cypher(query)
                .then(this.successDelete, this.error);
        },
        geocache_delete_by_username: function(username) {
            var query = "MATCH (g:Geocache { username: \"" + username + "\" }) OPTIONAL MATCH (g)-[r]-() DELETE g, r";
            return this.cypher(query)
                .then(this.successDelete, this.error);
        },
        geocache_delete_by_email: function(email) {
            var query = "MATCH (g:Geocache { email: \"" + email + "\" }) OPTIONAL MATCH (g)-[r]-() DELETE g, r";
            return this.cypher(query)
                .then(this.successDelete, this.error);
        },
        geocaches_purge: function() {
            var query = "MATCH (g:Geocache) DELETE g";
            //TODO
        },
        geocache_username_taken: function(username) {
            var query = "MATCH (g:Geocache) WHERE g.username = \"" + username +
                "\" RETURN " + this.geocache_return("g");
            return this.cypher(query)
                .then(this.successTaken, this.error);
        },
        geocache_email_taken: function(email) {
            var query = "MATCH (g:Geocache) WHERE g.email = \"" + email +
                "\" RETURN " + this.geocache_return("g");
            return this.cypher(query)
                .then(this.successTaken, this.error);
        }
    };
    return geocacheDB;
}