import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const queryNestDates = createAsyncThunk(
    'nestDates/query',
    async () => {
        const apiKey = process.env.REACT_APP_RESTDB_X_API_KEY;
        const baseUrl = process.env.REACT_APP_RESTDB_NEST_ENDPOINT;

        console.log('queryNestDates');
        const queryUrl = `${baseUrl}?q={"$distinct": "date"}`;
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
        const uniqueDates = getResponse.data;
        console.log('uniqueDates:', uniqueDates);

        return uniqueDates;
    }
);

export const nestDatesSlice = createSlice({
    name: 'nestDates',
    initialState: {
        records: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(queryNestDates.pending, state => {
                state.status = 'loading';
            })
            .addCase(queryNestDates.fulfilled, (state, action) => {
                state.status = 'succeeded';
                console.log('action.payload:', action.payload);
                // Only add new records
                action.payload.forEach(newRecord => {
                    if (!state.records.some(existingRecord => existingRecord === newRecord)) {
                        state.records.push(newRecord);
                        console.log('newRecord:', newRecord);
                    }else{
                        console.log('existingRecord:', newRecord);
                    }
                });
            })
            .addCase(queryNestDates.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default nestDatesSlice.reducer;
