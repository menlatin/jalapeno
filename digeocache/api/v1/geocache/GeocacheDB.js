module.exports = function GeocacheDB() {
    var geocacheDB = {
        /* Geocache Cypher Queries */
        geocache_return: function(alias) {
            return " id(" + alias + ") AS id, " +
                alias + ".title AS title, " +
                alias + ".message AS message, " +
                alias + ".lat AS lat, " +
                alias + ".lng AS lng, " +
                alias + ".currency AS currency, " +
                alias + ".amount AS amount, " +
                alias + ".is_physical AS is_physical, " +
                alias + ".delay AS delay, " +
                alias + ".drop_count AS drop_count, " +
                alias + ".created_on AS created_on, " +
                alias + ".updated_on AS updated_on";
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
        geocaches_by_id: function(id) {
            var query = "MATCH (g:Geocache) WHERE id(g) = " + id +
                " RETURN " + this.geocache_return("g");
            return this.cypher(query)
                .then(this.successOneOrNone, this.error);
        },
        geocaches_by_username: function(username) {
            var query = "MATCH (g:Geocache) WHERE g.username = \"" + username +
                "\" RETURN " + this.geocache_return("g");
            return this.cypher(query)
                .then(this.successOneOrNone, this.error);
        },
        geocaches_by_email: function(email) {
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