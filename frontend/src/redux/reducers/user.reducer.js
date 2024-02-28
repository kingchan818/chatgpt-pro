import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const register = createAsyncThunk('users/fetchByIdStatus', async (openAIAPIKey, thunkAPI) => {
  try {
    const response = await axios({
      method: 'post',
      url: 'http://192.168.1.7:8181/auth/register',
      data: { openAIAPIKey },
    });
    localStorage.setItem('apiKey', response.data.apiKey);
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response.data);
  }
});

export const validateInviteToken = createAsyncThunk('users/validateInviteToken', async (inviteToken, thunkAPI) => {
  try {
    // TODO: handle invite token should create a api function that validate the invite token

    const response = setTimeout(() => true, 1000);
    localStorage.setItem('apiKey', inviteToken);
    return response;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response.data);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentUser: (state, action) => ({ ...state, currentUser: action.payload }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => ({
        ...state,
        loading: true,
      }))
      .addCase(register.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        currentUser: action.payload,
      }))
      .addCase(register.rejected, (state, action) => ({ ...state, loading: false, error: action.payload }))
      .addCase(validateInviteToken.pending, (state) => ({
        ...state,
        loading: true,
      }))
      .addCase(validateInviteToken.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        currentUser: action.payload,
      }))
      .addCase(validateInviteToken.rejected, (state, action) => ({ ...state, loading: false, error: action.payload }));
  },
});

export const { setCurrentUser, checkUserSessions } = userSlice.actions;

export default userSlice.reducer;
