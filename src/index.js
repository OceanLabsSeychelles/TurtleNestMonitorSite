import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';import History from "./History";
import Header from "./components/Header"
import Live from "./Live"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import DiveMap from "./pages/DiveMap";
import SessionMap from "./pages/SessionMap";
import Login from "./pages/Login";
const rootElement = document.getElementById("root");
import store, { persistor } from './store';
ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Header/>
            <BrowserRouter>
                <Routes>
                    <Route index element={<Login/>}/>
                    <Route path="login" element={<Login/>}/>
                    <Route path="live" element={<Live/>}/>
                    <Route path="history" element={<History/>}/>
                    <Route path="dives" element={<DiveMap/>}/>
                    <Route path="session" element={<SessionMap/>}/>
                </Routes>
            </BrowserRouter>
        </PersistGate>
    </Provider>
  </StrictMode>,
  rootElement
);
