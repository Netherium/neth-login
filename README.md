# Neth-login

A prototype login system written in NestJS and Angular

## Features

___

### Server (NestJS)

- Local/JWT Guards and Strategies
- TypeOrm
- Async Config
- Throttling
- Validation Errors
- OpenApi documentation
- E2E testing

### Client (Angular 13)

- RxJS/HttpGenerics
- ReactiveForms
- Validation Errors
- Angular Material with theming
- Splash Screens, PWA ready
- AuthGuards
- Basic components/services testing

## Quick Start

___

### Checkout Repo

- `git clone https://github.com/Netherium/neth-login.git`

### Start Server

- Navigate to folder `cd ./nestjs-server`
- Install dependencies `npm install`
- Copy `.env.sample` to `.env`
- Start docker containers for DB `docker compose up -d`
- Start the server `npm run start`
- Browse to http://localhost:3000/api/docs, to view the OpenApi documentation

### Start client

- Navigate to folder `cd ./ng-client`
- Install dependencies `npm install`
- Start the client `npm run start`
- Browse to http://localhost:4200, to view the app

## Run Test Suites

### Server

- Navigate to folder `cd ./nestjs-server`
- Start E2E testsuite `npm run test:e2e`

### Client

- Navigate to folder `cd ./ng-client`
- Start testsuite `npm run test`

Made with ❤ by Netherium
