# Hubble UX

## What is this?

This is a react client application which serves as UI to interact
with hubble API. 

## How to run this application?

### Start in development mode

```shell
# In hubble UX directory
npm install
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.


### Production build
```shell
npm run build
```

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build directory can be served with a static server like `apache` or python `http.server`. The `index.html` in the build folder will be the entry point of the app and the statis files are loaded from `build/static` directory.

## Testing
```shell
npm test
```

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

