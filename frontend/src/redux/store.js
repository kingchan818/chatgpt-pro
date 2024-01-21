import { configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from '@redux-devtools/extension';
import modelConfiguratorReducer from './reducers/modelConfigurator.reducer';
import userReducer from './reducers/user.reducer';

const store = configureStore(
  {
    reducer: {
      modelConfigurator: modelConfiguratorReducer,
      user: userReducer,
    },
  },
  process.env.NODE_ENV === 'dev' ? composeWithDevTools() : undefined,
);

export default store;
