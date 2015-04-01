# jalapeno
Super Secret Jalapeno Project

## diGeoCache

Cryptocurrency-based game

## Workspace Setup Instructions

__nodemon__ is a monitor script for use during development of node.js apps. The "-g" global optio nis necessary to install nodemon to the bin path.

```
$ npm install -g nodemon
```

__nodemon__ is used when starting up the application, using the --harmony flag, because diGeoCache utilizes the Koa framework which uses javascript generator functions -- features of Javascript ES6

__n__ is a node version manager which allows you to easily switch between node versions.  Because diGeoCache utilizes the Koa framework which utilizes javascript generator functions, the latest node version (at least 0.12.0) will be needed.

```
$ npm install -g n
```

Installing a version is as simple as typing "n" followed by the version.

```
$ n 0.12.0
```
Changing the active version is as simple as typing "n" and using the arrow keys to select one of the installed versions of node.

```
$ n
```

The package.json file contains a list of the fundamental NPM dependencies.  Among other options, this file describes the entry-point javascript file into the app "server.js" and the script used to start it.

## diGeoCache REST API

The API is designed to be simple and pragmatic.  Resources (e.g. - Users), in general, represent nodes in a Neo4j database.  

For relationship-based and compound queries, the response objects may deviate and expand upon the CRUD (create, read, update, delete) behavior associated with the pure POST, GET, PUT, and DELETE HTTP methods.


For example, "Friend" is not a node label in the Neo4j database, but is indicated by the relationships between nodes such as ":FRIENDS_WITH".  Using these relationships, a query can produce the list of mutual friends between two or more users.  The full set of properties of the users might be known to initiate the request for mutual friends, but having the __input__ packaged with the derived output can provide benefit to the consumers of the API by reducing the complexity of the view logic and to the producer by minimizing the load on the server through unnecessary follow-up requests.

Note: "<diGeoCache>" will be used as a temporary subsitute for a host name.


```js
// Example Javascript
function hola() {
	// This is a test for README.md formatting
}
```


### Pure REST Queries

#### Admins

#### Users

#### Geocaches

#### Products

#### Listings

### Derived Relationship Queries

#### Mutual Friends

#### Dropped Geocaches

#### Recent Activity (Feed)

#### Geocaches Dropped By Users Whose Product I Liked