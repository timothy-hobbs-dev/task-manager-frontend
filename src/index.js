import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// index.js
import { AuthProvider } from "react-oidc-context";

//use base url from .env file
const origin = window.location.origin;

console.log(`${origin}/dashboard`)

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_IzC1zCuKg",
  client_id: "4uagl7rknlj7tg55ofpg3agidf",
  redirect_uri: `${origin}/dashboard`,
  response_type: "code",
  scope: "aws.cognito.signin.user.admin email openid phone profile",
};

const root = ReactDOM.createRoot(document.getElementById("root"));

// wrap the application with AuthProvider
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);


