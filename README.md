# Backend Template

A useful example of typescript and graphql. It a simple create, update, delete and get of tasks server which has a title (for now).

## Pre-requisite

- Node version: 12.18.3 - `nvm install 12.18.3 && nvm alias default 12.18.3`
- Yarn version: 1.22.4
- Tslint version: 5.18.0
- Install [MongoDB Community Edition](https://docs.mongodb.com/manual/administration/install-community/)
- Cluster on [Mongo Atlas](https://www.mongodb.com/cloud/atlas/lp/try2?utm_source=google&utm_campaign=gs_americas_argentina_search_core_brand_atlas_desktop&utm_term=mongodb%20atlas&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=12212624305&gclid=CjwKCAiA1eKBBhBZEiwAX3gql4GnLSq4Lb8BeM7ZzRdlDwXmtO3kAOynjndQUITYz_fcKdcBMcCP5RoCUNcQAvD_BwE)

## Configure VS Code

- Install [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- Run `mkdir .vscode` on the <project_root>
- Create a `settings.json` file
- Add the following lines on it:

```
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Get Started

1. Clone the project
2. Move to the <project_root>
3. Run `yarn`
4. Run `yarn start`
5. Server should be running on `http://localhost:4000/graphql`

## Envs

The env file should have the following variables

```
PORT_BE=4000
DATABASE_URL='mongodb+srv://<username>:<password>@<cluster_url>'
ENVIRONMENT='dev'
```

## Commands

### `yarn start`

Runs the server

The server will reload if you make edits.
You will also see any lint errors in the console.

### `yarn lint`

Runs a check of lint

### `yarn lint:fix`

Fix some errors while checking lint

### `yarn build`

Creates the build for production

### `yarn serve-app`

Runs the build server

## Developed with 🛠️

- Express
- Mongoose
- Boom
- Nodemon
- Body Parser
- Cors
- Typescript
- GraphQl
