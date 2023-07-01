import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSession = createAsyncThunk(
    'session/fetch',
    async (sessionId) => {
        const queryUrl = `https://sfasurf-8806.restdb.io/rest/dreamdb?q={"sessionId":"${sessionId}"}`;
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
        return getResponse.data; // All records for the given sessionId
    }
);

export const divesSlice = createSlice({
    name: 'dives',
    initialState: {
        records: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchSession.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchSession.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.records= []; // Clear the array
                console.log('Session data:', action.payload);
                // Add any fetched records to the array
                state.records = state.records.concat(action.payload);
            })
            .addCase(fetchSession.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default divesSlice.reducer;
