import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

import graphDataSlice from './reducers/graphDataSlice';
import divesSlice from './reducers/divesSlice';
import sessionSlice from './reducers/sessionSlice';
import authSlice from './reducers/authSlice';
import nestDatesSlice from "./reducers/nestSlice";
import nestDateSlice from "./reducers/nestDateSlice";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'dives', 'session', 'graphData']
};

const rootReducer = combineReducers({
  graphData: graphDataSlice,
  dives: divesSlice,
  session: sessionSlice,
  auth: authSlice,
  nestDates: nestDatesSlice,
  nestDate: nestDateSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;
