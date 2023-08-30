import { combineReducers } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "./reducers/authentication/authentication";
import filterReducer from "./reducers/filter/filter";
import permissionReducer from "./reducers/permission/permission";
import allDataReducer from "./reducers/allData/allData";
import tutorialReducer from "./reducers/tutorial/tutorial";
import screenReducer from "./reducers/screen/screen";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const persistConfig = {
  key: "persist-key",
  storage: AsyncStorage,
  version: 1,
};

const appReducer = combineReducers({
  authentication: authenticationReducer,
  tutorial: tutorialReducer,
  screen: screenReducer,
  filter: filterReducer,
  allData: allDataReducer,
  permission: permissionReducer,
});

const persistedReducer = persistReducer(persistConfig, appReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
