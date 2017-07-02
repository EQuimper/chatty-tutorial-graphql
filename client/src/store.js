import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ApolloClient, { createNetworkInterface } from 'apollo-client';

import { navigationReducer } from './navigation';

const networkInterface = createNetworkInterface({ uri: 'http://localhost:8080/graphql' });

export const client = new ApolloClient({
  networkInterface,
});

export const store = createStore(
  combineReducers({
    apollo: client.reducer(),
    nav: navigationReducer,
  }),
  undefined,
  composeWithDevTools(
    applyMiddleware(client.middleware()),
  ),
);