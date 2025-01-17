import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// index.js
import { AuthProvider } from "react-oidc-context";

//use base url from .env file
const baseUrl = process.env.REACT_APP_BASE_URL;
const origin = window.location.origin;

console.log(`${origin}/dashboard`)

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_DaEPtiEmo",
  client_id: "4dnc8h177ghqf6tb9u7d33uk68",
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


