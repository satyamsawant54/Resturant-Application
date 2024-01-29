import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Provider } from 'react-redux';

import App from './App';
import store from './store';

const theme = extendTheme({
  colors: {
    brandBlue: "#11273F",   
    brandGreen : "#18D26E",  
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </Provider>   
  </React.StrictMode>
);