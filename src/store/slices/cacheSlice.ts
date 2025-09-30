
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cache } from '../../types/cache';

const CACHE_KEY = '@jar/cache';

const initialState: Cache = {};

const cacheSlice = createSlice({
  name: 'cache',
  initialState,
  reducers: {
    updateCacheState(state, action: PayloadAction<Partial<Cache>>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateCacheState } = cacheSlice.actions;

export default cacheSlice.reducer;

export const updateCache = (updates: Partial<Cache>) => async (dispatch: any) => {
  try {
    const cacheFromStorage = await localStorage.getItem(CACHE_KEY);
    if (cacheFromStorage) {
      const parsedCacheFromStorage: Cache = JSON.parse(cacheFromStorage);
      const updatedCache = { ...parsedCacheFromStorage, ...updates };
      await localStorage.setItem(CACHE_KEY, JSON.stringify(updatedCache));
      dispatch(updateCacheState(updatedCache));
    } else {
      await localStorage.setItem(CACHE_KEY, JSON.stringify(updates));
      dispatch(updateCacheState(updates));
    }
  } catch (error) {}
};

export const loadInitialCache = () => async (dispatch: any) => {
  try {
    const cache = localStorage.getItem(CACHE_KEY);
    if (cache) {
      const parsed: Cache = JSON.parse(cache);
      if (parsed) {
        dispatch(updateCacheState(parsed));
      }
    }
  } catch (error) {}
};
