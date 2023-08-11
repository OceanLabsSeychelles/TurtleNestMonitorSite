import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const graphQuery = createAsyncThunk(
    'nestGraph/query',
    async (payload,thunkAPI) => {
        const desiredDate = new Date(payload);
        const formattedDate = desiredDate.toISOString().split('T')[0];
        const queryUrl = `https://sfasurf-8806.restdb.io/rest/tnmd-beta?q={"date": "${formattedDate}"}`;
        const axiosOptions = {
            method: 'GET',
            url: queryUrl,
            headers: {
                'cache-control': 'no-cache',
                'x-apikey': '629678a3c4d5c3756d35a40e',
                'content-type': 'application/json'
            }
        };

        const response = await axios(axiosOptions);
        console.log(response.data);
        return response.data;
    }
);

export const nestGraphSlice = createSlice({
    name: 'nestGraph',
    initialState: {
        records: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(graphQuery.pending, state => {
                state.status = 'loading';
            })
            .addCase(graphQuery.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.records = action.payload;
            })
            .addCase(graphQuery.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default nestGraphSlice.reducer;
