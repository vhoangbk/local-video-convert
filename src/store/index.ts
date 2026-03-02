import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import appReducer from "./slices/appSlice";
import optionReducer from "./slices/optionSlice";

// Create logger middleware
const logger = createLogger({
  // Only log in development
  predicate: () => process.env.NODE_ENV === 'development',
  // Collapse log groups by default
  collapsed: true,
  // Show duration of each action
  duration: true,
  // Show timestamp
  timestamp: true,
  // Customize colors
  colors: {
    title: () => "#139BFE",
    prevState: () => "#9E9E9E",
    action: () => "#149945",
    nextState: () => "#4CAF50",
    error: () => "#F20404",
  },
});

export const store = configureStore({
  reducer: {
    option: optionReducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
