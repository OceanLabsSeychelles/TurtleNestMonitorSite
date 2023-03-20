import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DiveDREAM from "./DiveDREAM";
import HistoryNEST from "./HistoryNEST";
import LiveNEST from "./LiveNEST";
import MapDREAM from "./MapDREAM";
import Header from "./components/Header";
import store from "./store";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
            <Header/>
            <BrowserRouter>
                <Routes>
                    <Route index element={<LiveNEST/>}/>
                    <Route path="liveNEST" element={<LiveNEST/>}/>
                    <Route path="historyNEST" element={<HistoryNEST/>}/>
                    <Route path="mapDREAM" element={<MapDREAM/>}/>
                    <Route path="diveDREAM" element={<DiveDREAM/>}/>
                </Routes>
            </BrowserRouter>
    </Provider>
  </StrictMode>,
  rootElement
);
