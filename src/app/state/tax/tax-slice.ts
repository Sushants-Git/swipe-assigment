import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { isTaxInPercentage?: boolean } = {
    isTaxInPercentage: false,
};

const taxSlice = createSlice({
    name: "tax",
    initialState,
    reducers: {
        setIsTaxInPercentage: (state, action: PayloadAction<boolean>) => {
            state.isTaxInPercentage = action.payload;
        },
    },
});

export const { setIsTaxInPercentage } = taxSlice.actions;

export default taxSlice.reducer;
