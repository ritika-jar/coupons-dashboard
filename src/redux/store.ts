import { configureStore } from "@reduxjs/toolkit";

/**
 * Configures the Redux store with all feature-specific slice reducers.
 * This central store handles the global application state.
 */
export const store = configureStore({
  reducer: {},
});

/**
 * Type representing the entire Redux store state.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Type representing the Redux dispatch function.
 */
export type AppDispatch = typeof store.dispatch;
