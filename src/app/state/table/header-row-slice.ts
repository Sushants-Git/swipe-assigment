import { Row } from "@/app/page";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { headerRow: Row | null } = {
    headerRow: null,
};

const headerRowSlice = createSlice({
    name: "header-row",
    initialState,
    reducers: {
        changeHeader: (state, action: PayloadAction<Row | null>) => {
            state.headerRow = action.payload;
        },
    },
});

export const { changeHeader } = headerRowSlice.actions;

export default headerRowSlice.reducer;
