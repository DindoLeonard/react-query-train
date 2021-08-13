import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';
// import { SomeContextProvider } from "./store/some-context.jsx";

ReactDOM.render(
  <React.StrictMode>
    {/* <SomeContextProvider> */}
    <App />
    {/* </SomeContextProvider> */}
  </React.StrictMode>,
  document.getElementById('root')
);
