# Amatino JS

Amatino is a double-entry accounting system. It provides double entry accounting as a service via an HTTP API. Amatino JS is a library for interacting with the Amatino API from within a Node.js application. By using Amatino JS, a Node.js developer can utilise Amatino services without needing to deal with raw HTTP requests.

## Under construction

Amatino JS is in an Alpha state. It is not yet ready for widespread use and should not be used by anyone for anything important. 

Right now, the Amatino API offers a full range of accounting services via HTTP requests. However, the Amatino JS library's capabilities are limited. There is one class available: `AmatinoAlpha`. 

`AmatinoAlpha` is a thin wrapper around asynchronous HTTP requests to the Amatino API. It facilitates testing and experimentation with the Amatino API without having to resort to raw HTTP request manipulation and HMAC computation.

Amatino JS will eventually offer expressive, object-oriented interfaces for all Amatino API services. To be notified when Amatino JS enters a Beta state, with all capabilities available, sign up to the [Amatino Development Newsletter.](https://amatino.io/newsletter).

In the mean time, you may wish to review [Amatino's HTTP documentation](https://amatino.io/documentation) to see what capabilities you can expect from Amatino JS in the future.

## Installation

Amatino JS may be installed via [NPM](https://www.npmjs.com).

````
$ npm install amatino
````

To use Amatino JS, you will need an active Amatino subscription. You can start a free trial at [https://amatino.io/subscribe](https://amatino.io/subscribe).

## Example Usage

The ````AmatinoAlpha```` object allows you to use the Amatino API without dealing with raw HTTP requests or HMACs. It lacks the expressive syntax, input validation, and error handling that Amatino JS will have in the beta stage.

Initialise an  `AmatinoAlpha` instance like so:

````
require('amatino');

const amatinoAlpha = new AmatinoAlpha(
  'clever@cookie.com',
  'high entropy passphrase'
);
````

Request may then be made like so:

````
const myFirstEntity = amatinoAlpha.request(
  '/entities',
  'POST',
  null,
  [{
    'name': 'My First Entity',
    'description: null,
    'region_id': null
  }]
)[0];
````

Wherein the parameters passed to `request()` are the HTTP path, method, url parameters ('query string'),  and body laid out in the Amatino API HTTP documentation.

For example, the above request created an [Entity](https://amatino.io/documentation/entities). The requirements for Entity creation are available at https://amatino.io/documentation/entities#action-Create.

For more examples of `AmatinoAlpha` usage, see the [getting started guide](https://amatino.io/articles/getting-started).

## Tell us what your think/want/like/hate

Please join us on the [Amatino discussion forums and give us your feedback. We would love to hear from you. Amatino is in its earliest stages of development, and your feedback will influence the direction it moves in.

Pull requests, comments, issues, forking, and so on are also most welcome here on Github.

## Useful links

 - [Amatino home](https://amatino.io)
 - [Development blog](https://amatino.io/blog)
 - [Development newsletter](https://amatino.io/newsletter)
 - [Discussion forum](https://amatino.io/discussion) 
 - [More Amatino client libraries](https://github.com/amatino-code)
 - [Documentation](https://amatino.io/documentation)
 - [Billing and account management](https://amatino.io/billing)
 - [About Amatino Pty Ltd](https://amatino.io/about)
