import { configureStore } from "@reduxjs/toolkit";
import tableReducer from "./table/table-slice";

export const store = configureStore({
    reducer: {
        tables: tableReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
