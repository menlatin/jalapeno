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

var HttpCodes = Object.freeze(
	{
		/* Success */
		OK: 200,					// Susccessful GET
		CREATED: 201,				// Successful POST/PUT
		NO_CONTENT: 204, 			// Successful DELETE

		/* Redirection */
		FOUND: 302,					// Temporary redirect
		SEE_OTHER: 303,				// Response to request found on another URI using GET
									// When for PUT/POST/DELETE, redirect issued w/sep GET 
		NOT_MODIFIED: 304,			// Specified by If-Modified-Since or If-None-Match

		/* Client Error */
		BAD_REQUEST: 400, 			// Client error, malformed request
		UNAUTHORIZED: 401,			// Failed or uninitiated authentication
		FORBIDDEN: 403,				// Authenticated, but not allowed
		NOT_FOUND: 404,				// Does not exist or was removed
		METHOD_NOT_ALLOWED: 405,	// e.g. - DELETE "x" resource not part of API
		REQUEST_TIMEOUT: 408,		// Client inactivity
		CONFLICT: 409,				// e.g. - multiple update conflict
		IM_A_TEAPOT: 418,			// Teapots requested to brew coffee

		/* Server Error */
		INTERNAL_SERVER_ERROR: 500,	// Generic server error, unexpected condition
		NOT_IMPLEMENTED: 501,		// Future-Availability of API
		BAD_GATEWAY: 502,			// Server, as proxy, received bad upstream response
		SERVICE_UNAVAILABLE: 502,	// Overloaded, maintenance, etc.
		GATEWAY_TIMEOUT: 504,		// Server, as proxy, timed out
		INSUFFICIENT_STORAGE: 507	// Buy more hard drives.
	}
);

module.exports = HttpCodes;