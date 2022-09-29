import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const loadDate = createAsyncThunk(
    'graphData/loadDate',
    async (payload,thunkApi) => {
        thunkApi.dispatch(graphDataSlice.actions.setLoading(true))
        const state = thunkApi.getState();
        let response = await fetch(
            `https://sfasurf-8806.restdb.io/rest/tnmd?q={"date": "${state.graphData.fetchableDate}"}`,
        {
        headers: {
            "X-API-KEY": "629678a3c4d5c3756d35a40e",
            Accept: "application/json",
            "Content-Type": "application/json"
        }
        });

        let data = await response.json();
        return data;
    })

const loadLive = createAsyncThunk(
    'graphData/loadLive',
    async (payload,thunkApi) => {
        thunkApi.dispatch(graphDataSlice.actions.setLoading(true))
        const state = thunkApi.getState();
        let response = await fetch(
            `https://sfasurf-8806.restdb.io/rest/tnmd?q={"date": "live"}`,
            {
                headers: {
                    "X-API-KEY": "629678a3c4d5c3756d35a40e",
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            });

        let data = await response.json();
        return data;
    })

function getDateString(date) {
    const d = ("0" + date.getDate()).slice(-2)
    const m = ("0" + date.getMonth()).slice(-2)
    return `${date.getFullYear()}-${m}-${d}`
}
const initialDate = new Date(2022, 1, 1)

export const graphDataSlice = createSlice({
    name: "graphData",
    initialState: {
        live:{
            oxygen:0,
            humidity:0,
            temperature:0
        },
        noData:false,
        loading:false,
        oxygen:[],
        temperature:[],
        humidity:[],
        battery:[],
        date: initialDate.toJSON(),
        fetchableDate: getDateString(initialDate)

    },
    reducers: {
        setNoData(state, action) {
            state.noData = action.payload
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        incrementDate:(state,action) => {
            const date = new Date(state.date)
            let newDate = new Date()
            newDate.setTime(date.getTime()+1000 * 60 * 60 * 24)
            state.date = newDate.toJSON();
            state.fetchableDate = getDateString(newDate)
        },
        decrementDate:(state,action) => {
            const date = new Date(state.date)
            const newDate = new Date()
            newDate.setTime(date.getTime()-1000 * 60 * 60 * 24)
            state.date = newDate.toJSON();
            state.fetchableDate = getDateString(newDate)
        }
    },
    extraReducers:builder=> {
        builder.addCase(loadDate.fulfilled, (state, action) => {
            if (action.payload["0"]?.data === undefined) {
                state.loading = false;
                state.noData = true;
                return
            };
            const rawData = action.payload["0"].data;
            state.oxygen = [];
            state.temperature = [];
            state.humidity = [];
            rawData.forEach((point, index) => {
                state.oxygen.push({ x: index, y: point.oxygen });
                state.temperature.push({ x: index, y: point.temperature });
                state.humidity.push({ x: index, y: point.humidity });
            });
            state.loading = false
        })
        builder.addCase(loadLive.fulfilled, (state, action) => {
            const rawData = action.payload["0"].data;
            console.log(action.payload["0"].data)
            state.live.temperature = rawData.temperature;
            state.live.humidity = rawData.humidity;
            state.live.oxygen = rawData.oxygen;
        })
    }
});
export default graphDataSlice.reducer;
export const graphDataActions = {...graphDataSlice.actions, loadLive, loadDate}