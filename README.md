# test react node app

Demo project of a full-stack JavaScript e-commerce application

Tasks board/log available here https://github.com/amankkg/test-react-node/projects

Live demo TODO: (admin login:password is `admin`:`123`)

## Tech stack:

- frontend - Create React App (Babel), Redux, Redux Thunk, React Router and SCSS
- backend - Node.js and Express
- database - plain JSON file
- authorization - JWT and bcrypt

## npm scripts

- `npm ci` - install dependencies
- `npm run api-main` - run backend for main API in watch mode
- `npm run api-auth` - run backend for auth API in watch mode
- `npm run client` - run frontend in watch mode
- `npm run start` or `npm start` - run scripts `client`, `api-main`, and `api-auth` simultaneously
- `npm run test` or `npm t` - run tests in watch mode
- `npm run format` - format all source code

## Environment Variables

```dosini
# client
REACT_APP_MAIN_API_URL=your_main_backend_api_url
REACT_APP_AUTH_API_URL=your_auth_backend_api_url

# client proxy for development
REACT_APP_MAIN_API_PROXY_TARGET=your_main_api_target_for_proxy
REACT_APP_AUTH_API_PROXY_TARGET=your_auth_api_target_for_proxy

# server
MAIN_API_PORT=your_main_backend_api_port
AUTH_API_PORT=your_auth_backend_api_port
ACCESS_TOKEN=your_api_access_token
REFRESH_TOKEN=your_auth_api_refresh_token
TOKEN_TTL=token_time_to_live_in_seconds
```

## Project Structure

### Setup

- `./.env` and/or `./env.*` - configuration of environment variables per environment (e.g. production or development)
- `./package.json` - dependencies, npm scripts, and other settings
- `./src/setupProxy.js` - proxy settings for Create React App during development
- `./src/setupTests.js` - unit test settings for Create React App
- `./src/*/*.test.js` - unit tests for given file (e.g. `foo.js` and `foo.test.js`)
- `./__tests__/*` - end-to-end tests

### Frontend

- `./public/*` - static content
- `./src/components/*/*.{js,scss}` - re-usable components: unaware of Redux store/actions/thunks, styles are local only
- `./src/pages/*/*.{js,scss}` - app pages: components, styles are local, rely on Redux store/actions/thunks
- `./src/services/*` - services to interact with external APIs (backend, localStorage, etc.)
- `./src/actions/*` - actions
- `./src/thunks/*` - thunks
- `./src/reducers/*` - reducers
- `./src/index.js` - app entry point
- `./src/index.scss` - global styles and shared classes/variables
- `./src/app.js` - main App component with configured React Router and Redux
- `./src/store.js` - Redux store

### Backend

- `./src/api/auth.mjs` - auth API server
- `./src/api/main.mjs` - main API server
- `./src/api/db.json` - database storage
- `./src/api/dbal.mjs` - database access layer
