import React, { useState, useEffect, useRef } from "react";
import {
  XYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  LineSeries,
  Crosshair
} from "react-vis";
import { Row, Col } from "react-bootstrap";
import Styles from "./Styles";

export default function ResponsivePlot(props) {
  const color = props.color ? props.color : "darkcyan";
  const [windowSize, setWindowSize] = useState(getWindowDimensions());
  const [crosshairData, setCrosshairData] = useState({ x: 0, y: 0 });
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  const modes = ["noWobble", "gentle", "wobbly", "stiff"];
  const myRef = useRef();

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

  const handleResize = () => {
    setWindowSize(getWindowDimensions());
    setWidth(myRef.current.clientWidth);
    setHeight(myRef.current.clientHeight);
  };

  useEffect(() => {
    handleResize();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const data = [
    {x: 0, y: 8},
    {x: 1, y: 5},
    {x: 2, y: 4},
    {x: 3, y: 9},
    {x: 4, y: 1},
    {x: 5, y: 7},
    {x: 6, y: 6},
    {x: 7, y: 3},
    {x: 8, y: 2},
    {x: 9, y: 0}
  ];
    return (
      <XYPlot height={300} width= {300}>
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <LineSeries data={data} />
      </XYPlot>
      
    );
  }
}
