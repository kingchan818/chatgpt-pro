import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CHATGPT_MODELS } from '../../domain';
import { loadModels } from '../../services/api/chat-completion';

export const loadOpenAIModels = createAsyncThunk('model/loadAvailableModels', async (input, thunkAPI) => {
  const models = await loadModels();

  try {
    return models.map((ele) => ({
      id: ele.id,
      name: ele.id.split('-').slice(1).join(' '),
    }));
  } catch (e) {
    if (e.response?.data) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
    return thunkAPI.rejectWithValue(e);
  }
});

const modelConfiguratorSlice = createSlice({
  name: 'modelConfigurator',
  initialState: {
    currentModel: CHATGPT_MODELS[0],
    predefinedModels: CHATGPT_MODELS,
    availableModels: [],
    error: null,
    isProcessing: false,
  },
  reducers: {
    setCurrentModel: (state, action) => ({ ...state, currentModel: action.payload }),
    setAvailableModels: (state, action) => ({ ...state, models: action.payload }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadOpenAIModels.pending, (state) => ({ ...state, isProcessing: true }))
      .addCase(loadOpenAIModels.fulfilled, (state, action) => ({
        ...state,
        availableModels: action.payload,
      }))
      .addCase(loadOpenAIModels.rejected, (state, action) => ({ ...state, isProcessing: false, error: action.payload }));
  },
});

export const { setCurrentModel, setAvailableModels } = modelConfiguratorSlice.actions;

export default modelConfiguratorSlice.reducer;
