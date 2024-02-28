import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { isEmpty, get, omitBy, isUndefined } from 'lodash';
import { transformHelper } from '../../utils';
import { MAPPING_CONFIGS } from '../../domain';

export const handleSSEMessage = createAsyncThunk('chat/handleSSEMessage', async ({ message, parentMessageId }, thunkAPI) => {
  try {
    // TODO: create a axios service, that encapsulates the axios config
    let url;
    let requestData;

    if (!parentMessageId) {
      const { modelConfigurator } = thunkAPI.getState();
      console.log(modelConfigurator);
      const chatOptions = transformHelper(modelConfigurator, MAPPING_CONFIGS.TRANSFORM_MODEL_CONFIGURATOR_TO_CHAT_OPTIONS);
      console.log('chatOptions', chatOptions);

      url = 'http://localhost:8181/chat/create';
      requestData = omitBy({ message, chatOptions }, isEmpty);
    } else {
      url = 'http://localhost:8181/chat/continue';
      requestData = { message, parentMessageId };
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
    const data = get(response, 'data');
    const messageId = get(data, 'messageId');
    const transformMessage = transformHelper(data, MAPPING_CONFIGS.TRANSFORM_SAVED_MESSAGE_CONFIG);
    // push the saved message that comes from backend
    thunkAPI.dispatch(pushMessage(transformMessage));

    await fetchEventSource(`http://localhost:8181/chat/sse/${messageId}`, {
      headers: {
        'x-auth-key': localStorage.getItem('apiKey'),
      },
      onmessage(event) {
        const { data: streamMsg } = event;
        let res;
        if (!isEmpty(streamMsg)) {
          res = JSON.parse(streamMsg);
        }

        if (res && res.text) {
          thunkAPI.dispatch(setStreamMsg(res));
        }
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
    error: null,
  },
  reducers: {
    setStreamMsg: (state, action) => ({ ...state, streamMessage: action.payload }),
    setInputMsg: (state, action) => ({ ...state, inputMsg: action.payload }),
    pushMessage: (state, action) => ({ ...state, messages: [...state.messages, action.payload] }),
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

export const { setInputMsg, pushMessage, setStreamMsg } = chatSlice.actions;

export default chatSlice.reducer;
