# SLDS Calendar

## Lightning Design System Account Calendar Application

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Before you start

Due to a dependency on reset-date-cache, this project requires Node version 8.
The dependency will not compile in version 10.

Project dependencies and build script are managed with [yarn][]. Install yarn
and run this command to install project dependencies:

    $ yarn

[yarn]: https://yarnpkg.com/lang/en/docs/install/

## Running in development mode

Run:

    $ yarn start

Then navigate a browser to http://localhost:3000/

As long as the `yarn start` command is running the app will automatically
rebuild when source files change. Refresh the browser to see changes.

## Running tests

Run:

    $ yarn test


## Deploying

First build the frontend app:

    $ yarn run build

That will create a Visualforce static resource with bundled Javascript and CSS
resources. Next push resources to Salesforce:

    $ force push -t ApexPage -n Calendar
    $ force push -t StaticResource -n Calendar
