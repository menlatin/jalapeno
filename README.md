# jalapeno
Super Secret Jalapeno Project

## diGeoCache

Cryptocurrency-based game

## Workspace Setup Instructions

Install node (min version 0.12.0) from https://nodejs.org/

__nodemon__ is a monitor script for use during development of node.js apps. The "-g" global option is necessary to install nodemon to the bin path.

```
$ npm install -g nodemon
```

__nodemon__ is used when starting up the application, using the --harmony flag, because diGeoCache utilizes the Koa framework (based off Node.js and Express.js) which uses javascript generator functions -- features of Javascript ES6.

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

Note: "diGeoCache" will be used as a temporary subsitute for a host name.

```js
// Example Javascript
function hola() {
	// This is a test for README.md formatting
}
```

### Pure REST Queries

#### Admins

| Endpoint | Description |
| ---- | --------------- |
| [POST /api/admins/](#post-admins) | Request new admin
| [GET /api/admins/](#get-admins) | Request admin list |
| [PUT /api/admins/](#put-admins) | Request bulk admin update  |
| [DELETE /api/admins/](#delete-admins) | Request bulk admin delete |
| [GET /api/admins/:id](#get-admins-id) | Request admin with id |
| [PUT /api/admins/:id](#put-admins-id) | Request admin edit with id |
| [DELETE /api/admins/:id](#delete-admins-id) | Request admin delete with id |

#### Users

| Endpoint | Description |
| ---- | --------------- |
| [POST /api/users/](#post-users) | Request new user
| [GET /api/users/](#get-users) | Request user list |
| [PUT /api/users/](#put-users) | Request bulk user update  |
| [DELETE /api/users/](#delete-users) | Request bulk user delete |
| [GET /api/users/:id](#get-users-id) | Request user with id |
| [PUT /api/users/:id](#put-users-id) | Request user edit with id |
| [DELETE /api/users/:id](#delete-users-id) | Request user delete with id |

#### Geocaches

| Endpoint | Description |
| ---- | --------------- |
| [POST /api/geocaches/](#post-geocaches) | Request new geocache
| [GET /api/geocaches/](#get-geocaches) | Request geocache list |
| [PUT /api/geocaches/](#put-geocaches) | Request bulk geocache update  |
| [DELETE /api/geocaches/](#delete-geocaches) | Request bulk geocache delete |
| [GET /api/geocaches/:id](#get-geocaches-id) | Request geocache with id |
| [PUT /api/geocaches/:id](#put-geocaches-id) | Request geocache edit with id |
| [DELETE /api/geocaches/:id](#delete-geocaches-id) | Request geocache delete with id |

#### Products

| Endpoint | Description |
| ---- | --------------- |
| [POST /api/products/](#post-products) | Request new product
| [GET /api/products/](#get-products) | Request product list |
| [PUT /api/products/](#put-products) | Request bulk product update  |
| [DELETE /api/products/](#delete-products) | Request bulk product delete |
| [GET /api/products/:id](#get-products-id) | Request product with id |
| [PUT /api/products/:id](#put-products-id) | Request product edit with id |
| [DELETE /api/products/:id](#delete-products-id) | Request product delete with id |

#### Listings

| Endpoint | Description |
| ---- | --------------- |
| [POST /api/listings/](#post-listings) | Request new listing
| [GET /api/listings/](#get-listings) | Request listing list |
| [PUT /api/listings/](#put-listings) | Request bulk listing update  |
| [DELETE /api/listings/](#delete-listings) | Request bulk listing delete |
| [GET /api/listings/:id](#get-listings-id) | Request listing with id |
| [PUT /api/listings/:id](#put-listings-id) | Request listing edit with id |
| [DELETE /api/listings/:id](#delete-listings-id) | Request listing delete with id |

### Derived Relationship Queries

#### Mutual Friends

#### Dropped Geocaches

#### Recent Activity (Feed)

#### Geocaches Dropped By Users Whose Product I Liked