import { configureStore } from "@reduxjs/toolkit";
import { newsApi } from "./features/api/newsApiSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [newsApi.reducerPath]: newsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(newsApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
