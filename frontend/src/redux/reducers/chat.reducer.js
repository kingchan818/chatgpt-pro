import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { isEmpty, get, omitBy, isUndefined, isNil } from 'lodash';
import { transformHelper } from '../../utils';
import { MAPPING_CONFIGS, ENDPOINTS } from '../../domain';

export const handleSSEMessage = createAsyncThunk('chat/handleSSEMessage', async ({ message }, thunkAPI) => {
  try {
    // TODO: create a axios service, that encapsulates the axios config
    let url;
    let requestData;

    let { currentCollectionId: collectionId } = thunkAPI.getState().chat;

    if (isEmpty(collectionId) || isNil(collectionId)) {
      const { modelConfigurator } = thunkAPI.getState();
      const chatOptions = transformHelper(modelConfigurator, MAPPING_CONFIGS.TRANSFORM_MODEL_CONFIGURATOR_TO_CHAT_OPTIONS);

      url = ENDPOINTS.CREATE_CHAT_ENDPOINT;
      requestData = omitBy({ message, chatOptions }, isEmpty);
    } else {
      url = ENDPOINTS.CONTINUE_CHAT_ENDPOINT;
      requestData = { message, collectionId };
    }

    const response = await axios({
      method: 'post',
      url,
      headers: {
        'Content-Type': 'application/json',
        'x-auth-key': localStorage.getItem('apiKey'),
      },
      data: omitBy(requestData, isUndefined),
    });

    let data = {};
    if (url === ENDPOINTS.CREATE_CHAT_ENDPOINT) {
      thunkAPI.dispatch(setCollectionId(get(response, 'data.1.collectionId')));
      data = get(response, 'data.1', {});
    } else {
      data = get(response, 'data', {});
    }

    collectionId = thunkAPI.getState().chat.currentCollectionId;
    const transformMessage = transformHelper(data, MAPPING_CONFIGS.TRANSFORM_USER_INPUT_CONFIG);
    // push the saved message that comes from backend
    thunkAPI.dispatch(pushMessage(transformMessage));

    await fetchEventSource(`http://localhost:8181/chat/sse/${collectionId}`, {
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
    });

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
