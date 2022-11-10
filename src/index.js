import { StrictMode } from "react";
import ReactDOM from "react-dom";
import store from "./store";
import { Provider } from "react-redux";
import History from "./History";
import Header from "./components/Header"
import Live from "./Live"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ReducerLauncher from "./components/ReducerLauncher";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
        <ReducerLauncher>
            <Header/>
            <BrowserRouter>
                <Routes>
                    <Route index element={<Live/>}/>
                    <Route path="live" element={<Live/>}/>
                    <Route path="history" element={<History/>}/>
                </Routes>
            </BrowserRouter>
        </ReducerLauncher>
    </Provider>
  </StrictMode>,
  rootElement
);
