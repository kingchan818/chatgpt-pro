import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { isEmpty, get, isNil } from 'lodash';
import { transformHelper } from '../../utils';
import { MAPPING_CONFIGS, ENDPOINTS } from '../../domain';
import { continueChat, createChat } from '../../services/api/chat-completion';

const createSSERequest = async (collectionId, thunkAPI) => {
  await fetchEventSource(`${ENDPOINTS.CHAT_SSE_ENDPOINT}/${collectionId}`, {
    headers: {
      'x-auth-key': localStorage.getItem('apiKey'),
    },
    onmessage(event) {
      const { data: streamMsg } = event;
      let res;
      if (!isEmpty(streamMsg)) {
        res = JSON.parse(streamMsg);
      }

      if (res && res.message) {
        res = transformHelper(res, MAPPING_CONFIGS.TRANSFORM_SAVED_MESSAGE_CONFIG);
        thunkAPI.dispatch(setStreamMsg(res));
      }

      return res;
    },

    onerror(event) {
      return event?.target?.close();
    },

    onclose(event) {
      return event?.target?.close();
    }
  });
}

export const handleSSEMessage = createAsyncThunk('chat/handleSSEMessage', async ({ message }, thunkAPI) => {
  try {

    let { currentCollectionId: collectionId } = thunkAPI.getState().chat;
    const { modelConfigurator } = thunkAPI.getState();
    const chatOptions = transformHelper(modelConfigurator, MAPPING_CONFIGS.TRANSFORM_MODEL_CONFIGURATOR_TO_CHAT_OPTIONS);
    let data = {};

    if (isEmpty(collectionId) || isNil(collectionId)) {
      data = await createChat(message, chatOptions);
      thunkAPI.dispatch(setCollectionId(get(data, 'collectionId')));
    } else {
      data = await continueChat(message, collectionId, chatOptions);
    }

    collectionId = thunkAPI.getState().chat.currentCollectionId;
    const transformMessage = transformHelper(data, MAPPING_CONFIGS.TRANSFORM_USER_INPUT_CONFIG);
    // push the saved message that comes from backend
    thunkAPI.dispatch(pushMessage(transformMessage));
    await createSSERequest(collectionId, thunkAPI);

    return data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    inputMsg: '',
    messages: [],
    streamMessage: {},
    isProcessing: false,
    currentMessageDetails: null,
    currentCollectionId: null,
    error: null,
  },
  reducers: {
    setStreamMsg: (state, action) => ({ ...state, streamMessage: action.payload }),
    setInputMsg: (state, action) => ({ ...state, inputMsg: action.payload }),
    pushMessage: (state, action) => ({ ...state, messages: [...state.messages, action.payload] }),
    setCollectionId: (state, action) => ({ ...state, currentCollectionId: action.payload }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleSSEMessage.pending, (state) => ({ ...state, isProcessing: true }))
      .addCase(handleSSEMessage.fulfilled, (state, action) => ({
        ...state,
        isProcessing: false,
        currentMessageDetails: action.payload,
        messages: [...state.messages, state.streamMessage],
        streamMessage: '',
      }))
      .addCase(handleSSEMessage.rejected, (state, action) => ({ ...state, isProcessing: false, error: action.payload }));
  },
});

export const { setInputMsg, pushMessage, setStreamMsg, setCollectionId } = chatSlice.actions;

export default chatSlice.reducer;
