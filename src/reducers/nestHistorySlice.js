import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const queryUniqueDates = createAsyncThunk(
    'nest/uniqueDates',
    async () => {
        const queryUrl = `https://sfasurf-8806.restdb.io/rest/tnmd-beta?q={"$distinct": "date"}`;
        const axiosOptions = {
            method: 'GET',
            url: queryUrl,
            headers: {
                'cache-control': 'no-cache',
                'x-apikey': '629678a3c4d5c3756d35a40e',
                'content-type': 'application/json'
            }
        };
        const getResponse = await axios(axiosOptions);

        return getResponse.data;
});

export const uniqueDatesSlice = createSlice({
    name: 'nestUniqueDates',
    initialState: {
        records: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(queryUniqueDates.pending, state => {
                state.status = 'loading';
            })
            .addCase(queryUniqueDates.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.records = action.payload;
            })
            .addCase(queryUniqueDates.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default uniqueDatesSlice.reducer;
