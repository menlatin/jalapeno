#!/bin/bash
DIR=$( cd "$( dirname "$0" )" && pwd )

export NEO4J_HOME=/usr/local/Cellar/neo4j/2.1.7/libexec
echo "Annhiliating Neo4J DB for Repopulation"
$NEO4J_HOME/bin/neo4j stop
DB=$NEO4J_HOME/data/graph.db
echo "DB Path = '${DB}'"
REMOVE_DB=`rm -rf ${DB}`
$NEO4J_HOME/bin/neo4j start
DIR_CQL=$DIR/neo4j_init.cql
$NEO4J_HOME/bin/neo4j-shell -c < ${DIR_CQL}



# npm install 
