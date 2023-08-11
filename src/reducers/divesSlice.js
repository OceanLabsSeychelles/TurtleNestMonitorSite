import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const queryDives = createAsyncThunk(
    'dives/query',
    async () => {
        const queryUrl = `https://sfasurf-8806.restdb.io/rest/dreamdb?q={"$distinct": "sessionId"}`;
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
        console.log('dives/query response:', getResponse);
        const uniqueSessionIds = getResponse.data;

        const earliestRecords = [];
        for (let sessionId of uniqueSessionIds) {
            const queryUrl = `https://sfasurf-8806.restdb.io/rest/dreamdb?q={"sessionId":"${sessionId}"}&sort=recordIndex&max=1`;
            const getResponse = await axios({ ...axiosOptions, url: queryUrl });
            const earliestRecord = getResponse.data[0];
            earliestRecords.push(earliestRecord);
        }
        return earliestRecords;
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
            .addCase(queryDives.pending, state => {
                state.status = 'loading';
            })
            .addCase(queryDives.fulfilled, (state, action) => {
                state.status = 'succeeded';
                console.log('action.payload:', action.payload);
                // Only add new records
                action.payload.forEach(newRecord => {
                    if (!state.records.some(existingRecord => existingRecord.sessionId === newRecord.sessionId)) {
                        state.records.push(newRecord);
                    }
                });
            })
            .addCase(queryDives.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default divesSlice.reducer;
