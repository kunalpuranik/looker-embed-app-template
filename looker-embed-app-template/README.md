# PBL React

## Introduction

The goal of this repository is to showcase how to implemente a simple Powered By Looker app, using the Looker SDKs, React and Node. The app is able to display data from a Looker instance using two different methods:

- Embedding a looker dashboard using [Looker Embed SDK](https://developers.looker.com/embed/embed-sdk)
- Using [Looker SDK](https://www.npmjs.com/package/@looker/sdk) to send custom queries to your Looker instance, and display results using custom visualizations

## Architecture

The app is split into 2 main components:

- A React frontend, depending on both Looker SDKs.
- A Node.js backend, serving the front-end and handling authentication requests to Looker.

The architecture is shown in the following picture:

![Architecture](./architecture.png)

### Front-end

By default, the front-end is authenticated using [Google Sign In](https://developers.google.com/identity/gsi/web/guides/overview). The `/login` page displays both the Sign In button and the Google One Tap prompt. For example purposes, this authentication is **local** to the browser. A real-world implementation should of course verify Google's JWT token and send it to the back-end, to create a session for the user and a Looker embed user with the appropriate permissions for their account.

Once logged in, the front-end is able to use the Looker Embed SDK to embed a Looker dashboard (or an explore, or custom view, etc.). The embed SDK is initialized with the URL of the Looker instance, and the backend routes to call to obtain the necessary access token for embedding. See `EmbedDashboard.jsx` for usage.

```js
LookerEmbedSDK.initCookieless(
  lookerConfig.host,
  '/api/acquire-embed-session',
  '/api/generate-embed-tokens'
)
```

The app also uses the Looker SDK, to be able to access raw data from the Looker instance using, predefined looks or custom queries. In this sample app, we use custom queries the System Activity models, retrieve the data as JSON, and display it using [Charts.js](https://www.chartjs.org/). See `SdkCustomView.jsx` for usage.

```js
sdk.run_inline_query({
  result_format: 'json',
  limit: 500,
  body: {
    model: 'system__activity',
    view: 'api_usage',
    fields: ['api_usage.total_usage', 'api_usage.api_query_type'],
    sorts: ['api_usage.total_usage desc 0']
  }
})
```

The SDK is initialized using a custom `ProxySession`, which retrieves a Looker API token from our back-end to authenticate all calls.

### Back-end

The back-end holds the credentials (`client_id` and `client_secret`) to the Looker instance, as well as the embed user configuration. It also depends on the Node version of the Looker SDK, to facilitate all API calls.

All endpoints are un-authenticated in this sample implementation.

On the `/login` endpoint, the back-end uses the credentials to acquire (or re-use) a Looker Session, and returns an API Key.

The `/acquire-embed-session` endpoint is called by the Looker Embed SDK before loading the iframe. It uses the current Looker session to acquire an **embed cookieless** session. See [Cookieless embedding](https://cloud.google.com/looker/docs/cookieless-embed) for details.

The last endpoint, `generate-embed-tokens`, is called periodically by the embed SDK to keep its cookieless session up to date.

## Running locally

To be able to run this app locally, you will need:

- `npm`
- Access to your Looker instance
- Looker API credentials (`client_id` and `client_secret`)
- Optionally, a [Google API client ID](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid) if you want your own Google Sign In.

### Installation

Install all dependencies with the following:

```sh
npm install
cd server/
npm install
```

### Configuration

The front and back ends both needs a working configuration before running. They expect the following environment variables to be defined:

```sh

# URLs to your Looker instance
REACT_APP_LOOKER_HOST=yourinstance.looker.com
REACT_APP_LOOKER_API_URL=https://yourinstance.looker.com

# Looker API Credentials
REACT_APP_LOOKER_CLIENT_ID=YOUR_CLIENT_ID
REACT_APP_LOOKER_CLIENT_SECRET=YOUR_CLIENT_SECRET

# (Optional) URL to your back-end (by default, the Node back-end running in the `server` folder)
REACT_APP_LOOKER_PROXY_URL=http://localhost:8080/api

# ID of the dashboard embedded on the dashboard page (make sure your embed user has access to it)
REACT_APP_LOOKER_DASHBOARD=1234

# ID of the Explore embedded on the Self Service page
REACT_APP_LOOKER_EXPLORE=model::explore

# (Optional) Client ID used for Google sign-in
REACT_APP_GSI_CLIENT_ID=myid.sapps.googleusercontent.com
```

This can also be achieved by filling the `sample-env.env` provided, and renaming it to `.env`.

The back-end also uses a static JSON file to configure its Looker session, `server/user.json`:

```json
{
  "external_user_id": "1234",
  "first_name": "John",
  "last_name": "Doe",
  "session_length": 3600,
  "force_logout_login": true,
  "permissions": ["access_data", "see_looks", "see_user_dashboards", "explore"],
  "models": ["yourmodel"],
  "user_attributes": { "locale": "en_US" }
}
```

This should be customized to point to an external embed user that exists on your Looker instance, along with a model and permissions they are able to access.

### Running

Single command to both build the app and serve it on `localhost:8080`:

```sh
npm run server
```

Running the front-end and back-end separately (i.e. to work on the front-end and benefit from hot-reloading). Front:

```sh
npm run start
```

and back:

```sh
cd server
npm start
```

This will have the front-end running on `localhost:3000`.
