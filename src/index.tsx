import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './redux/store';
import { Provider } from 'react-redux';
import { KitChat } from './kitchat/kitchat';

const root = ReactDOM.createRoot(document.getElementById('root')!);
const kc = KitChat.getInstance(
    '$2b$10$CEAc.O2JlvSpFvOfkxjgDu1LfBfNI9/v580shTEhI9iVuWc2hNZa.'
);
root.render(
    // <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
