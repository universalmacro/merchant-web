import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import { QueryClient, QueryClientProvider } from "react-query";

import reportWebVitals from './reportWebVitals';

if (process.env.NODE_ENV === 'production') {
  console.log = () => { }
  console.error = () => { }
  console.debug = () => { }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      suspense: true,
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
