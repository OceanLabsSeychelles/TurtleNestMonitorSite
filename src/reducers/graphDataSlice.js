import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const loadAll = createAsyncThunk(
    "graphData/loadAll",
    async(payload, thunkApi) => {
        let response = await fetch(
            `https://sfasurf-8806.restdb.io/rest/tnmd?q={"$distinct": "date"}&totals=true&count=true`,
            {
                headers: {
                    "X-API-KEY": "629678a3c4d5c3756d35a40e",
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            });

        let data = await response.json();
        console.log(data);
        const pageSize= 1000;
        const pageCount= Math.ceil(data.totals.count/pageSize);
        const allData = []
        for(let i=0;i<pageCount;i++){
            const endIndex = pageSize*(i+1)>data.length?data.length:pageSize*(i+1)
            console.log(pageSize*i,endIndex);
            let page = await fetch(
                `https://sfasurf-8806.restdb.io/rest/tnmd?skip=${pageSize*i}`,
                {
                    headers: {
                        "X-API-KEY": "629678a3c4d5c3756d35a40e",
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    }
                });
            const entry = await page.json();
            allData.push(entry);
            console.log(entry);
        }
        return allData;
    }
)

const loadDate = createAsyncThunk(
    'graphData/loadDate',
    async (payload,thunkApi) => {
        thunkApi.dispatch(graphDataSlice.actions.setLoading(true))
        const state = thunkApi.getState();
        console.log(`https://sfasurf-8806.restdb.io/rest/tnmd?q={"date": {"$regex" : "measurement-${state.graphData.fetchableDate}:*"}}`)

        let response = await fetch(
            `https://sfasurf-8806.restdb.io/rest/tnmd?q={"date": {"$regex" : "measurement-${state.graphData.fetchableDate}:*"}}&sort="date"`,
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
    return `${date.getFullYear()}-${Number(m)+1}-${d}`
}
const initialDate = new Date("11/28/2022")
console.log(initialDate.toJSON());

export const graphDataSlice = createSlice({
    name: "graphData",
    initialState: {
        allData: [],
        allLoaded: false,
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
        motion:[],
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
        builder.addCase(loadAll.fulfilled,(state, action)=>{
            state.allLoaded = true;
            const measurements = action.payload.flat().filter(entry =>entry.date.includes("measurement"))
            state.allData = measurements

        })
        builder.addCase(loadDate.fulfilled, (state, action) => {
            if (action.payload["0"]?.data === undefined) {
                state.loading = false;
                state.noData = true;
                return
            };
            const rawData = action.payload;
            state.oxygen = [];
            state.temperature = [];
            state.humidity = [];
            console.log("Unsorted: ",rawData);

            let sortedData = rawData.map(point=> {
                point.date = new Date(point.date.replace("measurement-", ""));
                return point;
            })
            sortedData.sort((a, b) => a.date>b.date)
            console.log("Sorted: ",sortedData);

            sortedData.forEach((point, index) => {
                if(point.data.motion !== 1) {
                    state.oxygen.push({x: point.date, y: point.data.oxygen});
                    state.temperature.push({x: point.date, y: point.data.temperature});
                    state.humidity.push({x: point.date, y: point.data.humidity});
                    state.motion.push({x:point.date, y: 0});

                }else{
                    state.motion.push({x:point.date, y: 1});
                }
            });
            console.log("Humidity: ",state.humidity)
            state.loading = false
        })
        builder.addCase(loadLive.fulfilled, (state, action) => {
            const rawData = action.payload["0"].data;
            state.live.temperature = rawData.temperature;
            state.live.humidity = rawData.humidity;
            state.live.oxygen = rawData.oxygen;
        })
    }
});
export default graphDataSlice.reducer;
export const graphDataActions = {...graphDataSlice.actions, loadLive, loadDate, loadAll}