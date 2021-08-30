# LearnitMonorepo

### The api

## nx commands

To use these command install ts-node globally

```shell
npm install -g ts-node
```

Commands

```shell
#drop database
nx run api:drop-db
#synchronize entity-definitions into db
nx run api:sync-db
#seed database with data defined in *.entity.factory.ts files
#and seeders defined in *.seed.ts files
nx run api:seed-db

```

## setup

# Postgres notes

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

## The webapp

The webapp uses the NextJS framework to benefit from

- Bundle splitting with dynamic imports
- Easy static and server side rendering
- Nextjs Image component

However, using NextJS ties the webapp to the inflexible routing solution provided.
To still be able to reap all the benefits of an SPA the App bypasses NextJS routing system on certain parts. This approach is taken from [Colin McDonnell](https://github.com/colinhacks) and described in this [blogpost](https://colinhacks.com/essays/building-a-spa-with-nextjs)

# required env variables

- API_URL=http://localhost:3070
- SIGNUP_ROUTE=auth/signup
- LOGIN_ROUTE=auth/login

# starting the webapp

`nx run webapp:serve`

# Starting the mobile app

`nx run-android rnapp`

This project was generated using [Nx](https://nx.dev).

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

## ☁ Nx Cloud

### Distributed Computation Caching & Distributed Task Execution

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
