# 31242 Advanced Internet Programming - Assessment 2

## IOU Tracking System

[ioweyou.tech](https://ioweyou.tech/) is a web application for tracking "IOU"s or "favours". It allows groups or teams to log in and record the favors that they owe to each other as well as make public requests in return for favors.

|   Number   | Student Name         |
| :--------: | :------------------- |
| `13532787` | Christopher Kesoglou |
| `13584228` | Kevin Leung          |
| `13562133` | Hasith Jayasekera    |
| `13583950` | James Lee            |
| `13564291` | Sean Tran            |

## Further Documentation

- [API Specification markdown](<./docs/API Specification.md>)
- [API Specification openapi](./docs/openapi.yml)
- [Database schema and Entity Relationship Diagram](<./docs/Database Schema.md>)
- [Design Storyboards](<./docs/Design Storyboards.md>)

---

## Installation Guide

## Pre-requisites

1. [Git](https://git-scm.com/) (used for source control and required to commit changes)
2. [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) package manager (required to install modules required by the application)
3. [Node.js](https://nodejs.org/en/) version 12.x (required to run the application - other Node versions not tested but may still work)
4. [Microsoft SQL Server](https://www.microsoft.com/en-au/sql-server/sql-server-downloads) 2019 (supported database by the application)

**Head over to the next section to learn how to clone the repository and set-up the local database connection.**

## Installation

1. Clone the repository using Git CLI, Git Desktop Client, or "Download zip" within GitHub then extract.
2. Open your terminal of choice in the root of the project (inside the cloned repository).
3. Change directory in to the "react" folder and install then build using your package manager:

```
C:\..\31242-AIP> cd react
C:\..\31242-AIP\react> npm install
C:\..\31242-AIP\react> npm run build
```

4. Navigate back into the root directory of the project and install then build using your package manager:

```
C:\..\31242-AIP\react> cd ..
C:\..\31242-AIP> npm install
C:\..\31242-AIP> npm run build
```

## Setup

Create a `.env` file in the root directory of the project and set your environmental variables. The following properties are available:

| Variable    | Description                                                                 | Default               |
| :---------- | :-------------------------------------------------------------------------- | :-------------------- |
| DB_HOST     | Hostname of the database server.                                            | `localhost`           |
| DB_NAME     | Name of the database.                                                       | `iou`                 |
| DB_USERNAME | Username for database server user.                                          | ``                    |
| DB_PASSWORD | Password for database server user.                                          |                       |
| PORT        | Port the application will run and serve requests on.                        | `3000`                |
| JWT_SECRET  | Secret used to encrypt access and refresh tokens.                           | `ioweyou.tech`        |
| PERSISTENT  | Use persisted MSQL database (true) or temporary in memory database (false). | `true`                |
| NODE_ENV    | Node environemnt description.                                               | (usually already set) |

## Rapid testing tip

For rapid testing of the application _without_ the need to setup a Microsoft SQL Server database, you can omit all the DB_x properties and simply add `PERSISTENT=false` to your `.env`. Note that this will reset the database every time the application restarts.

When `NODE_ENV=development` is set in your `.env` or in your environment, a developer-only endpoint is enabled (`/api/items/populate`). A simple GET request to this endpoint will populate the items table with three sample items. This is intended to be used in conjunction with the above non-persistent setting as it is otherwise difficult to administratively create items on the in memory database, and items are required for the majority of the application's functionality.

---

## Contribution Guide

### API Design

**API designs are all written in the same [docs/openapi.yaml](docs/openapi.yaml) file**. It utilises the [OpenAPI v3 specification](https://swagger.io/docs/specification/about/) that details the API endpoints and their authentication schemas, required request body attributes and return values. Completing the API design first allows for both the front and back end implementation to be worked on simultaneously, and thus you should put a lot of thought into how your endpoint will be structured and behave since they will be adhered to exactly as specified.

You may find that it is easiest to document a new endpoint by first copy/pasting a similar existing endpoint within the file, then adjusting the descriptions, examples, attributes and return values to match the new design. This helps to minimise errors by basing it off known good syntax. The API specification documentation linked above can help guide you through how to detail any new unique aspects of your endpoint that is not yet part of a existing design.

**[Swagger Editor](https://editor.swagger.io/)** is a popular and recommended open-source website for editing the api specification document and offers **live previewing** of generated documentation to assist with development. However, you can use any graphical or commandline based editor you like that supports the OpenAPI v3 specification - simply copy/paste in the existing file, make your changes, then copy/paste it back for your commit.

Before you create your pull request, you will need to regenerate the markdown file used for easier viewing of the API design. Widdershins is a development dependency that has been added and is used to create this documentation. To do so, run the following commands from the root of the project in the terminal of your choice:

```
cd docs
node ../node_modules/widdershins/widdershins.js openapi.yaml -o API\ Specification.md --language_tabs 'javascript:JavaScript' --omitHeader
```

If successful, you should see your api design changes in [docs/API Specification.md](docs/API%20Specification.md) alongside some auto generated code samples. **You should never need to edit this file manually**.

Things to consider when designing your API:

- What returned [status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) will best convey the behaviour of the back end?
- Could any single endpoint be better designed by splitting it into two or more endpoints instead?
  - eg: It might be better to have two endpoints for recording a favour, one for when you are the creditor and another for when you are the debtor. This allows for a single validation layer for each endpoint in regards to when photo proof is required as part of the request or not.
- Would this API design be suitable / compatible for a third party front end application to interface with?
  - ie: Redirection responses of `3XX` should not be referencing our front end. In these scenarios, return a different status code and have the redriection logic be handled by the front end itself.

### Front-End Design and Best Project Practices

Although at the time of writing this, it is still at the initial stages of the project, the crucial first few React components have been built and foundation groundwork has been completed in the login and sign-up features. **You do not need to do a TS build when developing for front end.**

### Creating a new component

Firstly, when creating a new component, think about whether you need it is a new 'page' or just a re-usable 'component'. By this I mean - can it be navigated to? If so, then it should be placed in the 'pages' folder; it also may need to be constructed as a Route Component - a React component that inherits React Router's functionality to fully integrate with [React Router](https://reactrouter.com/web/guides/quick-start)'s navigation.

Next, due to the nature of having a five-man development squad, **we need to have unit tests for every single component. There is very little room for exceptions - for example the theme component which cannot be tested.**

Also, think about whether the React component should be a **function or a class**. This matters because it impacts readability and simplicity of the code and that makes a big difference. This however, doesn't mean everything should be a function if it saves lines of code; as Ben noted, it matters how easily understood your code is. Also, think about [React Hooks](https://reactjs.org/docs/hooks-intro.html).

### Testing

We are using [Enzyme](https://enzymejs.github.io/enzyme/docs/api/) and [Jest](https://jestjs.io/docs/en/tutorial-react) to test our React components. Enzyme is essentially a tool that simplifies your testing of components specifically (kind of like a JQuery for tests). You can render components as HTML or fully dynamic and interact with them to simulate real clicks and whatnot - like how I've done in my login.test.tsx's button clicks. Jest is the underlying testing framework and it provides the test runner which is super useful - it hot reloads when you save! Building tests is a lot of trial and error but luckily I've done examples for you in my login component :)
Also I advise to modularise your code as much as is reasonable so it's easier when it comes to testing as code scope and variable access plays a role.

### Libraries and useful information

We are using Mirage JS for API mocking. This works for both tests and 'production' (I say this but it's not really going to be deployed to production - it's moreso 'development' code). You can see more at [Mirage JS](https://miragejs.com/)'s official website, but here is the gist of it coming from me:

- It allows you to create a server object. This object can override specified urls to hijack them and provide a response that you design. This is extremely useful as you can effectively create without a back-end
- In testing, you can override the development code mocking with test-only API responses to allow for one-off mocks
- You can also theoretically mock databases and models

We also have **css in separate files/folders**. This was a design choice from both Sean and I. There was multiple options and arguably better ones at that, but we thought for familiarity and development time, that it'd be more reasonable to stick with the standard css approach. All you have to do is reference the css file in the imports at the top of the React component.

### Back-End Implementation

1. Create interface and class declarations for new models in `src/entities`. The class should extend the Sequelize Model class. The file should be named after the singular entity (e.g. `User.ts` not `Users.ts`).

2. Create the entity DAO (Data Access Object) in `src/daos`. The file should be named the plural entity (e.g. `Users.ts` not `User.ts`).

   - Initialise the Model with Sequelize DataTypes - this should be consistent with the database [docs/schema.sql](docs/schema.sql).
   - Define data access functions that will return the response values for API requests.

3. Define the associated routes in a file named after the plural entity in `src/routes`.

   - Define router endpoints and request methods consistent with [docs/API Specification.md](docs/API%20Specification.md).
   - Write the request handler function including parameter validation using [Joi](https://github.com/sideway/joi), error handling, authentication, and other necessary manipulation
   - Return appropriate response codes and errors consistent with [docs/API Specification.md](docs/API%20Specification.md).

4. Add the appropriate sub-routes to [src/routes/index.ts](src/routes/index.ts)

### Integrating Front-End and Back-End

1. Add the appropriate endpoint to [react/src/api/endpoints.tsx](react/src/api/endpoints.tsx)
2. Create associated page/component in `react/src/pages` or `react/src/components` respectively
   - When creating a new page, add an associated Route component to [react/src/components/App.tsx](react/src/components/App.tsx)
3. Use `fetch` to call the API endpoint (refer to [docs/API Specification.md](docs/API%20Specification.md) for code samples) and handle the various responses.
