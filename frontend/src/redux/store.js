import { configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from '@redux-devtools/extension';
import modelConfiguratorReducer from './reducers/modelConfigurator.reducer';

const store = configureStore(
  {
    reducer: {
      modelConfigurator: modelConfiguratorReducer,
    },
  },
  process.env.NODE_ENV === 'dev' ? composeWithDevTools() : undefined,
);

export default store;
