import { configureStore } from "@reduxjs/toolkit";
import graphDataSlice from "./reducers/graphDataSlice";

export default configureStore({
  reducer: {
    graphData: graphDataSlice,

  }
});
