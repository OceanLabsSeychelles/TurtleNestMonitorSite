import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSession = createAsyncThunk(
    'session/fetch',
    async (sessionId) => {
        const MAX_RECORDS = 1000;
        let allRecords = [];
        let skip = 0; // This will be used to skip records we've already fetched
        console.log(JSON.stringify(process.env));
        while (true) {
            const queryUrl = `${process.env.RESTDB_DREAM_ENDPOINT}q={"sessionId":"${sessionId}"}&max=${MAX_RECORDS}&skip=${skip}`;
            const axiosOptions = {
                method: 'GET',
                url: queryUrl,
                headers: {
                    'cache-control': 'no-cache',
                    'x-apikey': process.env.RESTDB_X_API_KEY,
                    'content-type': 'application/json'
                }
            };F

            const getResponse = await axios(axiosOptions);
            const data = getResponse.data;

            // Add the fetched records to the allRecords array
            allRecords = allRecords.concat(data);

            // If the number of records fetched is less than MAX_RECORDS, break out of the loop
            if (data.length < MAX_RECORDS) {
                break;
            }

            // Otherwise, increase the skip value to fetch the next set of records
            skip += MAX_RECORDS;
        }

        const seen = new Set();
        const uniqueRecords = allRecords.filter(item => {
            const isDuplicate = seen.has(item.nedbId);
            seen.add(item.nedbId);
            return !isDuplicate;
        });

        return uniqueRecords;
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
