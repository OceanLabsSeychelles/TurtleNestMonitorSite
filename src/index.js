import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HistoryDREAM from "./HistoryDREAM";
import HistoryNEST from "./HistoryNEST";
import LiveDREAM from "./LiveDREAM";
import LiveNEST from "./LiveNEST";
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
                    <Route path="liveDREAM" element={<LiveDREAM/>}/>
                    <Route path="historyDREAM" element={<HistoryDREAM/>}/>
                </Routes>
            </BrowserRouter>
    </Provider>
  </StrictMode>,
  rootElement
);
