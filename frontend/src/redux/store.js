import { composeWithDevTools } from '@redux-devtools/extension';
import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './reducers/chat.reducer';
import modelConfiguratorReducer from './reducers/modelConfigurator.reducer';
import userReducer from './reducers/user.reducer';
import chatHistoryReducer from './reducers/chatHistory.reducer';

const store = configureStore(
  {
    reducer: {
      modelConfigurator: modelConfiguratorReducer,
      user: userReducer,
      chat: chatReducer,
      chatHistory: chatHistoryReducer,
    },
  },
  process.env.NODE_ENV === 'dev' ? composeWithDevTools() : undefined,
);

export default store;
