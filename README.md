# Server for a app to manage parking cards

We this service we can have an application to manage parking cards. This started because of the mess 
we had by using an spreadsheet, so with this we can in some away enforce users to use this 
and therefore have a better organization inside our company.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What you will need to start the app

`node`
`yarn`

### Installing

A step by step of how to get a development env running.
<br><br>
Start by installing node modules
```
yarn install
```

And then you can start the app

```
yarn start:dev
```

Now you can acess `http://localhost:4000/graphql` and play with the graphql playground

App is being served on `http://localhost:4000/api` to make *HTTP* requests

## Running the tests

At this time I did not implemented tests. (soon we will have them :) )


## Deployment

Further more in time I want to deploy this app and have a pipeline for it so we can publish new versions and update the prod env

## Built With

* [SQLLite3](https://www.sqlite.org/version3.html)
* [TypeOrm](https://typeorm.io/)
* [Graphql](https://typegraphql.ml/docs/introduction.html)
* [Express](https://expressjs.com/en/4x/api.html)
* [TypeScript](https://www.typescriptlang.org/docs/home.html)

## Authors

* **Marco Escaleira** - marco.escaleira@mindera.com


## Acknowledgments

* Mindera Hackathon
