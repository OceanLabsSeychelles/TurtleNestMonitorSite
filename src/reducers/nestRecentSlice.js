import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const queryRecent = createAsyncThunk(
    'nest/recent',
    async () => {
        const queryUrl = `https://sfasurf-8806.restdb.io/rest/tnmd-beta?sort=datetime&dir=-1&max=1`;
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
        console.log('nest/recent response:', getResponse)
        return getResponse.data[0];
    }
);

export const recentSlice = createSlice({
    name: 'nest',
    initialState: {
        recent: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(queryRecent.pending, state => {
                state.status = 'loading';
            })
            .addCase(queryRecent.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.recent = action.payload;
            })
            .addCase(queryRecent.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default recentSlice.reducer;
