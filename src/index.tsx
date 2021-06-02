import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import store from "./store";
import showResults from "./showResults";
import SimpleForm from "./SimpleForm";

import './index.css';

// import App from './App';

// ReactDOM.render(
//     <App />,
//     document.getElementById('root')
// );

const rootEl = document.getElementById("root");

ReactDOM.render(
    <Provider store={store}>
      <div style={{ padding: 25 }}>
        <h2>Simple Form with Date Time Field</h2>
        <SimpleForm onSubmit={showResults} />
      </div>
    </Provider>,
    rootEl
);