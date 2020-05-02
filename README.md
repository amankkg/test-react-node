# test react node app

Demo project of a full-stack JavaScript e-commerce application

Tasks board/log available here https://github.com/amankkg/test-react-node/projects

Live demo TODO: (admin credentials `admin`:`123`)

## Tech stack:

- frontend - Create React App (Babel), Redux, Redux Thunk, React Router and SCSS
- backend - Node.js and Express
- database - a single JSON file
- authorization - JWT and bcrypt

## npm scripts

- `npm ci` - install dependencies
- `npm run client` - run frontend in watch mode
- `npm run server` - run backend in watch mode
- `npm run start` or `npm start` - run both above scripts simultaneously
- `npm run test` or `npm t` - run tests in watch mode
- `npm run format` - format all source code

## Environment Variables

```dosini
# client
REACT_APP_API_URL=your_backend_api_url
REACT_APP_AUTH_API_URL=your_auth_backend_api_url

# server
API_PORT=your_backend_api_port
AUTH_API_PORT=your_auth_backend_api_port
ACCESS_TOKEN=your_api_access_token
REFRESH_TOKEN=your_auth_api_refresh_token
TOKEN_TTL=token_time_to_live_in_seconds
```

## Project Structure

### Client app

#### folders

- `./public/*` - static content
- `./src/api/*` - services to work with backend APIs
- `./src/components/*/*.{js,scss}` - re-usable components: unaware of Redux store/actions/thunks, styles are local only
- `./src/pages/*/*.{js,scss}` - app pages: components, styles are local, rely on Redux store/actions/thunks

#### Redux folders

- `./src/actions/*` - actions
- `./src/thunks/*` - thunks
- `./src/reducers/*` - reducers

#### app files

- `./src/index.js` - app entry point
- `./src/index.scss` - global styles and shared classes/variables
- `./src/app.js` - main App component with configured React Router and Redux
- `./src/store.js` - Redux store

#### setup files

- `./src/setupProxy.js` - proxy settings for development
- `./src/setupTests.js` - Jest settings

### Server apps

- `./src/server/api.mjs` - main API server
- `./src/server/auth.mjs` - auth API server

### Other files

- `./.env` or `./env.*` - environment variables (for different environments)
- `src/*/*.test.js` - unit tests for given file
- `./db.json` - database storage
- `./package.json` - dependencies, npm scripts, and other settings
