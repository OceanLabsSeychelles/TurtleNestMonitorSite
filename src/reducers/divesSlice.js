import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const queryDives = createAsyncThunk(
    'dives/query',
    async () => {
        const queryUrl = `${process.env.REACT_APP_RESTDB_DREAM_ENDPOINT}?q={"$distinct": "sessionId"}`;
        const axiosOptions = {
            method: 'GET',
            url: queryUrl,
            headers: {
                'cache-control': 'no-cache',
                'x-apikey': process.env.REACT_APP_RESTDB_X_API_KEY,
                'content-type': 'application/json'
            }
        };

        const getResponse = await axios(axiosOptions);
        const uniqueSessionIds = getResponse.data;

        const earliestRecords = [];
        for (let sessionId of uniqueSessionIds) {
            const queryUrl = `${process.env.REACT_APP_RESTDB_DREAM_ENDPOINT}?q={"sessionId":"${sessionId}"}&sort=recordIndex&max=1`;
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
