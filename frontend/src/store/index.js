import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import {logger} from "redux-logger";
import authReducer from "./authSlice";
import friendReducer from "./friendSlice";
import rootSaga from "../sagas/rootSaga";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    auth: authReducer,
    friends: friendReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware, logger),
});

sagaMiddleware.run(rootSaga);

export default store;
