# Amatino JS

Amatino is an accounting engine. It stores, organises, and retrieves financial information via an HTTP API. Amatino JS is a library for interacting with the Amatino API from within a Node.js application. By using Amatino JS, a Node.js developer can utilise Amatino services without needing to deal with raw HTTP requests.

## About Amatino

Amatino gives you a full set of tools to store, organise and retrieve financial information. You don't need to set up databases or write any of your own double-entry accounting logic. All you need is this library, an [Amatino account (Try free for two weeks!)](https://amatino.io/subscribe), and you are off and running.

## Under construction

Right now, the Amatino API offers a full range of accounting services via HTTP requests. However, this Amatino JS library is under construction. Its capabilities are limited to a subset of Amatino services.

To facilitate the use of those services not yet supported, Amatino JS includes the `AmatinoAlpha` class. `AmatinoAlpha` is a thin wrapper around asynchronous HTTP requests to the Amatino API. It facilitates testing and experimentation with the Amatino API without having to resort to raw HTTP request manipulation and HMAC computation.

Amatino JS will eventually offer expressive, object-oriented interfaces for all Amatino API services. To be notified when Amatino JS enters a Beta state, with all capabilities available, sign up to the [Amatino Development Newsletter](https://amatino.io/newsletter) or follow [@AmatinoAPI](https://twitter.com/amatinoapi) on Twitter.

In the mean time, you may wish to review [Amatino's HTTP documentation](https://amatino.io/documentation) to see what capabilities you can expect from Amatino JS in the future.

## Installation

Amatino JS may be installed via [NPM](https://www.npmjs.com/package/amatino).

````bash
$ npm install amatino
````

To use Amatino JS, you will need an active Amatino subscription. You can start a free trial at [https://amatino.io/subscribe](https://amatino.io/subscribe).

## Documentation

Amatino JS is [documented via its GitHub Wiki](https://github.com/amatino-code/amatino-js/wiki/Documentation). Each class entry includes comprehensive description of properties and methods, and examples of their usage. For example, check out the [Entity class](https://github.com/amatino-code/amatino-js/wiki/Entity).

## Example Usage

All interactions with Amatino start with a [Session](https://github.com/amatino-code/amatino-js/wiki/Session). Creating a Session is analogous to 'logging in' to the service. We create a Session like so:

```javascript
const _ = Session.createWithEmail(
  "clever@cookie.com",
  "high entropy passphrase",
  (error, session) => {
    console.log(session.userId) // E.g. logs "46892412"
});
```

We can then use that Session to utilise Amatino services. For example, we can create an [Entity](https://github.com/amatino-code/amatino-js/wiki/Entity). Entities are objects, beings, and constructs that we wish to describe with financial information. For example, companies, people, or projects.

```javascript
const _ = Entity.create(
  session, // from the Session.createWithEmail() example above
  "My First Entity",
  "Cayman Islands holding company",
  null,
  (error, entity) => {
    console.log(entity.name) // Logs "My First Entity"
});
```

Within Entities, we structure financial information into [Accounts](https://github.com/amatino-code/amatino-js/wiki/Account). For example, a bank account, revenue from sales of goods and services, a credit card, or shareholder equity.

```javascript
const _ = Account.createWithGlobalUnitDenomination(
  session,
  entity, // from the Entity.create() example above
  "Subscription income",
  Type.revenue,
  null,
  5, // Happens to be the ID for U.S. Dollars
  null,
  "Sweet loot from accounting software subscriptions",
  null,
  (error, account) => {
    console.log(account.name) // Logs 'Subscription income'
]);
```

We can then store [Transactions](https://github.com/amatino-code/amatino-js/wiki/Transaction): Exchanges of value between Accounts. 

```javascript
Transaction.create(
  session,
  entity,
  new Date(),
  "Recognition receipt of sweet loot",
  5,
  null,
  [
    new Entry(Side.credit, '', subscriptionRevenue, "420"),
    new Entry(Side.debit, '', customerDeposits, "42"),
    new Entry(Side.debit, '', cash, "388")
  ],
  (error, transaction) => {
    console.log("Stored " + transaction.description);
  }
);
```

Objects such as Balances, Recursive Ledgers, Positions, and Trees then provide you with powerful tools to manipulate and retrieve financial data.  Those and other objects are not yet available in Amatino JS (We're racing to add them as soon as possible).

In the mean time, the `AmatinoAlpha` object allows you to experiment with as-yet unsupported services without dealing with raw HTTP requests or HMACs. It lacks the expressive syntax, input validation, and error handling that characterise supported objects such as [Transaction](https://github.com/amatino-code/amatino-js/wiki/Transaction).

Initialise an  `AmatinoAlpha` instance like so:

````javascript
const Amatino = require('amatino');

let _ = Amatino.AmatinoAlpha.createWithEmail(
  'clever@cookie.com',
  'high entropy passphrase',
  (error, amatinoAlpha) => {
    // Do stuff with amatinoAlpha
  }
);
````

Requests may then be made like so:

````javascript
let _ = amatinoAlpha.request(
  '/entities',
  'POST',
  null,
  [{
    'name': 'My First Entity',
    'description': null,
    'region_id': null
  }],
  (error, responseData) => {
    const newEntity = responseData[0];
    // Do stuff with newEntity
  }
);
````

Wherein the parameters passed to `request()` are the HTTP path, method, url parameters ('query string'),  and body laid out in the [Amatino API HTTP documentation](https://amatino.io/documentation).

For example, the above request created an [Entity](https://amatino.io/documentation/entities). The requirements for Entity creation are available at https://amatino.io/documentation/entities#action-Create.

For more examples of `AmatinoAlpha` usage, see the [getting started guide](https://amatino.io/articles/getting-started).

## Running tests

Amatino JS features a unit test suite. You can execute the test suite like so:

````bash
$ npm test
````

The test suite requires the presence of two environment variables: `AMATINO_TEST_EMAIL` and `AMATINO_TEST_SECRET`. These variables must be populated with the email address and passphrase of an Amatino user account with a valid subscription. For example:

````bash
$ export AMATINO_TEST_EMAIL=clever@cookie.com
$ export AMATINO_TEST_SECRET="some high entropy passphrase"
````


## JavaScript API stability & versioning

Amatino JS obeys the [Semantic Version](https://semver.org) convention. Until v1.0.0, the JavaSript API should be considered unstable and liable to change at any time.

>**Watch out! API currently unstable!**

You can see available versions [in GitHub's releases section](https://github.com/amatino-code/amatino-js/releases) or [under NPM's 'Versions' heading](https://www.npmjs.com/package/amatino).

## Tell us what your think/want/like/hate

Please join us on the [Amatino discussion forums](https://amatino.io/discussion) and give us your feedback. We would love to hear from you. Amatino is in its earliest stages of development, and your feedback will influence the direction it moves in.

Pull requests, comments, issues, forking, and so on are also [most welcome on Github](https://github.com/amatino-code/amatino-js)!

## Useful links

 - [Amatino home](https://amatino.io)
 - [Development blog](https://amatino.io/blog)
 - [Development newsletter](https://amatino.io/newsletter)
 - [Discussion forum](https://amatino.io/discussion) 
 - [More Amatino client libraries](https://github.com/amatino-code)
 - [Documentation](https://amatino.io/documentation)
 - [Billing and account management](https://amatino.io/billing)
 - [About Amatino Pty Ltd](https://amatino.io/about)
 
## Get in contact

To quickly speak to a human about Amatino, [email hugh@amatino.io](mailto:hugh@amatino.io) or [yell at him on Twitter (@hugh_jeremy)](https://twitter.com/hugh_jeremy).


