# diGeoCache API

Cryptocurrency-based game

## Workspace Setup Instructions

Install node (min version 0.12.0) from https://nodejs.org/

__gulp__ handles live-reloading of the development server and re-runs test cases to ensure functionality is preserved.  Gulp is a task manager that also handles running scripts for cleanup and baselining.

For example, the following task, defined in gulpfile.js, will execute a shell script which stops the local neo4j database server, wipes out the database, restarts the database, and repopulates with baseline data defined in CSV files.  This is useful if your database has gotten out of sync (has zombie nodes) during development.

```
$ gulp clean
```

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

The package.json file contains a list of the fundamental NPM dependencies.  Among other options, this file describes the entry-point javascript file into the app "server.js" and the script used to start it.  Gulp is delegated to kick off the appropriate tasks.

## diGeoCache REST API

The API is designed to be simple and pragmatic.  Resources (e.g. - Admin, User, Geocache, Wallet, Product, Listing, etc.), in general, represent nodes in a Neo4j database.  

For relationship-based and compound queries, the response objects may deviate and expand upon the CRUD (create, read, update, delete) behavior associated with the pure POST, GET, PUT, and DELETE HTTP methods.


For example, "Friend" is not a node in the Neo4j database, but is a relationship between nodes such as ":FRIENDS_WITH".  Using these relationships, a query can produce the list of mutual friends between two or more users.

Note: "diGeoCache" will be used as a temporary subsitute for a host name.

```js
// Example Javascript
function hola() {
	// This is a test for README.md formatting
}
```

### REST API V1

#### [Authentication](docs/authentication.md)
| Endpoint | Description |
| ---- | --------------- |
| [POST /api/v1/auth/admin/](docs/admin.md#post-admin-login) | Request new admin
| [POST /api/v1/auth/user/](docs/admin.md#post-user-login) | Request admin list |
| [GET /api/v1/auth/logout/](docs/admin.md#get-logout) | Request bulk admin update  |


#### [Admin](docs/admin.md)

| Endpoint | Description |
| ---- | --------------- |
| [POST /api/v1/admin/](docs/admin.md#post-admin) | Request new admin
| [GET /api/v1/admin/](docs/admin.md#get-admin-list) | Request admin list |
| [GET /api/v1/admin/:id](docs/admin.md#get-admin-by-id) | Request admin with id |
| [PUT /api/v1/admin/](docs/admin.md#put-admin-batch) | Request bulk admin update  |
| [PUT /api/v1/admin/:id](docs/admin.md#put-admin-by-id) | Request admin edit with id |
| [DELETE /api/v1/admin/](docs/admin.md#delete-admin-batch) | Request bulk admin delete |
| [DELETE /api/v1/admin/:id](docs/admin.md#delete-admin-by-id) | Request admin delete with id |

#### [User](docs/user.md)

| Endpoint | Description |
| ---- | --------------- |
| [POST /api/v1/user/](docs/user.md#post-user) | Request new user
| [GET /api/v1/user/](docs/user.md#get-user-list) | Request user list |
| [GET /api/v1/user/:id](docs/user.md#get-user-by-id) | Request user with id |
| [PUT /api/v1/user/](docs/user.md#put-user-batch) | Request bulk user update  |
| [PUT /api/v1/user/:id](docs/user.md#put-user-by-id) | Request user edit with id |
| [DELETE /api/v1/user/](docs/user.md#delete-user-batch) | Request bulk user delete |
| [DELETE /api/v1/user/:id](docs/user.md#delete-user-by-id) | Request user delete with id |

#### Geocache

| Endpoint | Description |
| ---- | --------------- |
| [POST /api/v1/geocaches/](#post-geocaches) | Request new geocache
| [GET /api/v1/geocaches/](#get-geocaches) | Request geocache list |
| [PUT /api/v1/geocaches/](#put-geocaches) | Request bulk geocache update  |
| [DELETE /api/v1/geocaches/](#delete-geocaches) | Request bulk geocache delete |
| [GET /api/v1/geocaches/:id](#get-geocaches-id) | Request geocache with id |
| [PUT /api/v1/geocaches/:id](#put-geocaches-id) | Request geocache edit with id |
| [DELETE /api/v1/geocaches/:id](#delete-geocaches-id) | Request geocache delete with id |

#### Wallet

| Endpoint | Description |
| ---- | --------------- |
| [POST /api/v1/geocaches/](#post-geocaches) | Request new geocache
| [GET /api/v1/geocaches/](#get-geocaches) | Request geocache list |
| [PUT /api/v1/geocaches/](#put-geocaches) | Request bulk geocache update  |
| [DELETE /api/v1/geocaches/](#delete-geocaches) | Request bulk geocache delete |
| [GET /api/v1/geocaches/:id](#get-geocaches-id) | Request geocache with id |
| [PUT /api/v1/geocaches/:id](#put-geocaches-id) | Request geocache edit with id |
| [DELETE /api/v1/geocaches/:id](#delete-geocaches-id) | Request geocache delete with id |

#### Currency

| Endpoint | Description |
| ---- | --------------- |
| [POST /api/v1/geocaches/](#post-geocaches) | Request new geocache
| [GET /api/v1/geocaches/](#get-geocaches) | Request geocache list |
| [PUT /api/v1/geocaches/](#put-geocaches) | Request bulk geocache update  |
| [DELETE /api/v1/geocaches/](#delete-geocaches) | Request bulk geocache delete |
| [GET /api/v1/geocaches/:id](#get-geocaches-id) | Request geocache with id |
| [PUT /api/v1/geocaches/:id](#put-geocaches-id) | Request geocache edit with id |
| [DELETE /api/v1/geocaches/:id](#delete-geocaches-id) | Request geocache delete with id |


#### Product

| Endpoint | Description |
| ---- | --------------- |
| [POST /api/v1/products/](#post-products) | Request new product
| [GET /api/v1/products/](#get-products) | Request product list |
| [PUT /api/v1/products/](#put-products) | Request bulk product update  |
| [DELETE /api/v1/products/](#delete-products) | Request bulk product delete |
| [GET /api/v1/products/:id](#get-products-id) | Request product with id |
| [PUT /api/v1/products/:id](#put-products-id) | Request product edit with id |
| [DELETE /api/v1/products/:id](#delete-products-id) | Request product delete with id |

#### Listing

| Endpoint | Description |
| ---- | --------------- |
| [POST /api/v1/listings/](#post-listings) | Request new listing
| [GET /api/v1/listings/](#get-listings) | Request listing list |
| [PUT /api/v1/listings/](#put-listings) | Request bulk listing update  |
| [DELETE /api/v1/listings/](#delete-listings) | Request bulk listing delete |
| [GET /api/v1/listings/:id](#get-listings-id) | Request listing with id |
| [PUT /api/v1/listings/:id](#put-listings-id) | Request listing edit with id |
| [DELETE /api/v1/listings/:id](#delete-listings-id) | Request listing delete with id |

### Derived Relationship Queries

#### Mutual Friends

#### Dropped Geocaches

#### Recent Activity (Feed)

#### Geocaches Dropped By Users Whose Product I Liked