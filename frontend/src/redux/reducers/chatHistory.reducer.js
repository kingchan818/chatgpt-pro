import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { get, set } from 'lodash';
import * as moment from 'moment';
import { TIME_UNIT } from '@/domain';
import { getTotalUsage } from '@/services/api/api-key';
import { queryUserUsage } from '../../services/api/chat-history';

export const handleQueryUserUsage = createAsyncThunk('usage/handleQueryUserUsage', async (_, thunkAPI) => {
  try {
    const { chatHistory } = thunkAPI.getState();
    const chatHistoryFilters = get(chatHistory, 'filters', {});
    const data = await queryUserUsage(chatHistoryFilters, chatHistoryFilters.unit);
    return data;
  } catch (e) {
    if (e.response?.data) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
    return thunkAPI.rejectWithValue(e);
  }
});

export const handleGetUserTotalUsage = createAsyncThunk('usage/handleGetUserTotalUsage', async (_, thunkAPI) => {
  try {
    const { count = 0, limit = 0 } = await getTotalUsage();
    return (count / limit) * 100;
  } catch (e) {
    if (e.response?.data) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
    return thunkAPI.rejectWithValue(e);
  }
});

const chatHistorySlice = createSlice({
  name: 'chatHistory',
  initialState: {
    usage: [],
    isProcessing: false,
    filters: {},
    error: null,
    userTotalUsage: {},
  },
  reducers: {
    setUsage: (state, action) => ({ ...state, usage: action.payload }),
    setFilter: (state, action) => {
      const newState = { ...state };
      const toDate = moment();
      let unit = TIME_UNIT.MONTH;
      let fromDate = toDate;
      switch (action.payload) {
        case TIME_UNIT.HISTORY.PASS_A_WEEK: {
          const value = TIME_UNIT.HISTORY.PASS_A_WEEK.values;
          unit = TIME_UNIT.DAY;
          fromDate = moment().subtract(value, 'days');
          break;
        }

        case TIME_UNIT.HISTORY.PASS_30_DAYS: {
          const value = TIME_UNIT.HISTORY.PASS_30_DAYS.values;
          unit = TIME_UNIT.DAY;
          fromDate = moment().subtract(value, unit);
          break;
        }

        case TIME_UNIT.HISTORY.PASS_6_MONTHS: {
          const value = TIME_UNIT.HISTORY.PASS_6_MONTHS.values;
          unit = TIME_UNIT.MONTH;
          fromDate = moment().subtract(value, unit);
          break;
        }
        case TIME_UNIT.HISTORY.PASS_A_YEAR: {
          const value = TIME_UNIT.HISTORY.PASS_A_YEAR.values;
          unit = TIME_UNIT.MONTH;
          fromDate = moment().subtract(value, unit);
          break;
        }
        default:
          break;
      }
      set(newState, 'filters', {
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
        unit,
      });

      return newState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleQueryUserUsage.pending, (state) => ({ ...state, isProcessing: true }))
      .addCase(handleQueryUserUsage.fulfilled, (state, action) => ({ ...state, usage: action.payload }))
      .addCase(handleQueryUserUsage.rejected, (state, action) => ({ ...state, isProcessing: false, error: action.payload }))
      .addCase(handleGetUserTotalUsage.pending, (state) => ({ ...state, isProcessing: true }))
      .addCase(handleGetUserTotalUsage.fulfilled, (state, action) => ({ ...state, userTotalUsage: action.payload }))
      .addCase(handleGetUserTotalUsage.rejected, (state, action) => ({ ...state, isProcessing: false, error: action.payload }));
  },
});

export const { setUsage, setFilter } = chatHistorySlice.actions;

export default chatHistorySlice.reducer;
