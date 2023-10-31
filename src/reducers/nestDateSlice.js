import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const queryNestDate = createAsyncThunk(
    'nestDate/query',
    async (date) => {
        const apiKey = process.env.REACT_APP_RESTDB_X_API_KEY;
        const baseUrl = process.env.REACT_APP_RESTDB_NEST_ENDPOINT;

        console.log('queryNestDate: ', date);
        const queryUrl = `${baseUrl}?q={"date":"${date}"}&metafields=true`;
        console.log('queryUrl:', queryUrl);
        const axiosOptions = {
            method: 'GET',
            url: queryUrl,
            headers: {
                'cache-control': 'no-cache',
                'x-apikey': apiKey,
                'content-type': 'application/json'
            }
        };

        const getResponse = await axios(axiosOptions);
        const records = getResponse.data;
        console.log('nest records:', records);
        return records;
    }
);

export const nestDateSlice = createSlice({
    name: 'nestDate',
    initialState: {
        records: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(queryNestDate.pending, state => {
                state.status = 'loading';
            })
            .addCase(queryNestDate.fulfilled, (state, action) => {
                state.status = 'succeeded';
                console.log('action.payload:', action.payload);
                // Only add new records
                state.records = [];
                state.records = action.payload;
            })
            .addCase(queryNestDate.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default nestDateSlice.reducer;
