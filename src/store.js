import { configureStore } from "@reduxjs/toolkit";
import graphDataSliceDREAM from "./reducers/graphDataSliceDREAM";
import graphDataSliceNEST from "./reducers/graphDataSliceNEST";


export default configureStore({
  reducer: {
    graphData: graphDataSliceNEST,
    graphDataDREAM: graphDataSliceDREAM,
  }
});
