import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './store/App_example';
// import { SomeContextProvider } from "./store/some-context.jsx";

ReactDOM.render(
  <React.StrictMode>
    {/* <SomeContextProvider> */}
    <App />
    {/* </SomeContextProvider> */}
  </React.StrictMode>,
  document.getElementById('root')
);
