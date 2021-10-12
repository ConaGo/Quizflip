# Quizzed

🚧 UNDER CONSTRUCTION 🚧

## About This Project

# English

Digital learning is ubiquitous and is by now a core part of most types of education; university, school, in-company training or learning in later stages of a career. If the digital material is presented in an appealing manner and fully embraced by the participants it can have a significant positive impact on the learning result.
Gamification can be the key to success in this endavour. The opportunity to progress in bite sized steps or to compete with your peers in quick games has great motivational potential.

The Vision of Quizzed is a platform for the collaborative creation and sharing of learning material. The project is open-source and using it is free.

The first iteration of Quizzed will provide means to create multiple choice questions with an optional explanation text. Users will be able to play single or multiplayer games with up to 12 questions. Since reflection is key to improvement there will also be a way to look into personal statistics about which question have been answered wrong or right.

# German

Digitale Lernmethoden sind allgegenwärtig und mittlerweile fester Bestandteil der meisten schulischen, universitären und betrieblichen Ausbildungswege. Wenn sie in ansprechender Form präsentiert und dementsprechend wahrgenommen werden können sie den Lernerfolg wesentlich positiv beeinflussen
Gameification kann dabei eine entscheidende Rolle spielen. Die Möglichkeit sich in kleinen Etappen spielend zu verbessen oder sich in mit anderen Lernenden im Spiel gegeinander zu messen hat großes Motivationspotential.

Die Vision von QuizLink ist eine Platform auf der kollaborativ Lernmaterial erstellt und geteilt werden kann. Das Projekt ist Open-Source und die Nutzung kostenlos.

In seiner ersten Iteration wird es für Mitwirkende die Möglichkeit geben multiple choice Fragen mit einem kurzen, optionalen Erklärungstext zu erstellen. Nutzer der App können in Rundenbasierten quizzes mit bis zu 12 Fragen allein oder gegeneinander ihr Wissen testen. Zudem wird es die Möglichkeit geben sich über eine persönliche Statistik zu informieren welche Fragen wie oft richtig oder falsch beantwortet wurden.

## Development

# Tech Stack

- Database -> Postgres
- Backend -> Node(NestJs)
- Frontend Web -> React(NextJs)
- Frontend App -> React Native

# Development Goals

1. Maintain good test coverage
2. Do not absctract to early - Make it work then refactor
3. Develop mobile- and web-application in sync

# Core Ideas

The app lives in a monorepo and is bootstrapped, organized and commanded through Nx

Besides some SQL for database queries and a bit of Swift/Java which is necessary for access to native Ios/Android -functionality this Project is completely written in Typescript

This of course comes with a few downsides. For Example:

- NestJs does not have a comparable ecosystem as F.e Spring Boot or ASP.NET since it is relatively new and mostly maintained by one person
- React native is still experimental and many essential modules are community-driven
- NodeJs is not the most performant option

To just name a few..
But this also opens up a few opportunities and QoL-improvements

- Less context switching
- Single Codestyle-configuration
- code sharing <- this is the main point

Code sharing enables quite a few convinient architectural possibilities. Nx code generation makes it very easy to extract shared code into libraries. The libs folder contains three libraries:
_Note that this project is still under heavy construction so naming of the folders and order of the content is subject to change, but the idea remains_

---

# shared-types

This folder currently contains data-transfer-object(dto)-definitions and corresponding [joi](https://github.com/sideway/joi)-validation-objects. Those are used for data validation when forms are filled in the frontend(App & Web) and to validate incoming requests in the backend. Also some shared Typescript interfaces and types.

# data-access

Contains all graphQL query strings and a custom [useForm hook](https://github.com/ConaGo/Learnit-App/blob/main/libs/data-access/src/lib/useForm.ts) that handles field-state, validation, error-setting and submition of forms[(have a look, i think it's pretty cool)](https://github.com/ConaGo/Learnit-App/blob/main/libs/data-access/src/lib/useForm.ts) It is used in all forms(App & Web).

# components

Every component of the app is split in three parts. A presentational component for the Web using [MaterialUI](https://material-ui.com/), a presentational component for React Native using [React-Native-Paper](https://callstack.github.io/react-native-paper/), and a hook that contains the shared logic.

This code sharing allows for very straightforward codechanges because the code resides in one place and is not spread over three projects.

However, the app is still in its early days and the viability of this approach is not yet proven :)

## The webapp

The webapp uses the NextJS framework to benefit from

- Bundle splitting with dynamic imports
- Easy static and server side rendering
- Nextjs Image component

However, using NextJS ties the webapp to the inflexible routing solution provided.
To still be able to reap all the benefits of an SPA the App bypasses NextJS routing system on certain parts. This approach is taken from [Colin McDonnell](https://github.com/colinhacks) and described in this [blogpost](https://colinhacks.com/essays/building-a-spa-with-nextjs)

## Current Features

- Jwt-based authentication flow with refresh-functionality utilizing http-only cookies
- Support for third-party authentication providers(Currently Google and Github)
- Claim-based authorization utilizing [casl](https://casl.js.org/v5/en/)
- Object-relational-mapping through typeorm and automated GraphQl-schema generation from decorated classes
- Custom joi validation pipe
- Automated database seeding utilizing factories and seeders
- Good Test coverage of the backend
- Login and register functionality for the webapp and the native App

---

# Project Setup

install [node](https://nodejs.org/en/download/)

install ts-node globally

```shell
npm install -g ts-node
```

install nx cli globally

```shell
npm install -g nx
```

install [docker](https://www.docker.com/products/docker-desktop)

create an .env file and fill out the same variables as povided in the .env.example file.

create an .env-cmdrc file. In this file you can provide environment variable overrides for specific scenarios.
An example is given in the .env-cmdrc.example file. To be able to run e2e-tests the "test" field has to override all variables for a test database that differ from the development DB specified in .env.

you can either use a local postgres service or use docker
if you want to use docker skip to the [next section](#Development)

Setup development Postgres database

## Postgres notes

1. Install postgres
2. Login as postgres user

```shell
sudo su - postgres
```

3. Login to psql shell

```shell
psql
```

4. Create a new user with password

```shell
create user bob with superuser password 'admin';
```

5. Install pgadmin4 as described [here](https://www.pgadmin.org/download/pgadmin-4-apt/)
6. Open pgadmin4
7. Click on 'Add New Server'
8. Give the server an arbitrary name
9. On connection tab enter the following

```
Hostname/ Address : localhost
Port : 5432
Maintenance database : postgres (always)
Username :  **bob** (the username youve chosen at 4.)
Password : admin (or any password you chose at 4.)
```

10. You are done. If it doesnt work yet please refer to the comprehensive answer to the following stackoverflow question
    https://stackoverflow.com/questions/53267642/create-new-local-server-in-pgadmin

# Development

## nx commands

### Starting the api

```shell
nx run api:serve
```

### Starting the webapp

`nx run webapp:serve`

### Starting the mobile app

`nx run-android rnapp`

# Commands

To use these command ts-node has to be installed globally

```shell
npm install -g ts-node
```

### Database

```shell
#drop database
nx run api:drop-db
#synchronize entity-definitions into db
nx run api:sync-db
#seed database with data defined in *.entity.factory.ts files
#and seeders defined in *.seed.ts files
nx run api:seed-db
#run all three command above
nx run api:setup-db

```

- Database logs can be found in root/ormlogs.log
- Note that seeding is done using the orm configuration in /apps/api/src/ormconfig.js

## Testing

```shell
#run all test suites in watch mode
#also starts postgres docker container defined in "docker-compose.test.yml for e2e tests
nx run api:test-watch
#or opt in to a local postgres service for testing
nx run api:test-watch-local
#run tests of a specific project
nx test api
nx test webapp
#etc..

```

# NX documentation:

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Smart, Extensible Build Framework**

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [React](https://reactjs.org)
  - `npm install --save-dev @nrwl/react`
- Web (no framework frontends)
  - `npm install --save-dev @nrwl/web`
- [Angular](https://angular.io)
  - `npm install --save-dev @nrwl/angular`
- [Nest](https://nestjs.com)
  - `npm install --save-dev @nrwl/nest`
- [Express](https://expressjs.com)
  - `npm install --save-dev @nrwl/express`
- [Node](https://nodejs.org)
  - `npm install --save-dev @nrwl/node`

There are also many [community plugins](https://nx.dev/nx-community) you could add.

## Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@learnit-monorepo/mylib`.

## Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
