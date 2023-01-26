import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import History from "./HistoryNEST";
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
                    <Route path="live" element={<LiveNEST/>}/>
                    <Route path="history" element={<History/>}/>
                </Routes>
            </BrowserRouter>
    </Provider>
  </StrictMode>,
  rootElement
);
