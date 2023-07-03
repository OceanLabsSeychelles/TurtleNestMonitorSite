import React, { useState, useEffect, useRef } from "react";
import {
  XYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  Crosshair,
  MarkSeries,
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


  const xData = props.data.map(entry => entry.x);
  const yData = props.data.map(entry => entry.y);
  if(xData.includes(undefined)|| yData.includes(undefined)) {
    return (
        <div style={Styles.BootstrapCenter} ref={myRef}>
          <Col style={Styles.BootstrapCenter} xs={12}>
            <Row style={{
              height:windowSize.height * props.height,
              width:windowSize.width * props.width,
              backgroundColor:"rgba(227,227,227,0.75)",
              borderRadius:"5px",
              alignItems:"center",
              justifyContent:"center",
              ...Styles.BootstrapCenter
            }}>
             Error Parsing Data !
           </Row>
          </Col>
        </div>
    );
  }

  if (!props.isMobile) {
    return (
      <div style={Styles.BootstrapCenter} ref={myRef}>
        <Col style={Styles.BootstrapCenter} xs={12}>
          <XYPlot
            xType={props.xType}
            height={windowSize.height * props.height}
            width={windowSize.width * props.width}
            animation={modes[0]}
          >
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis title={props.xtitle}/>
            <YAxis />
            <MarkSeries
                size={4}
                data={props.data}
                color={color}
                onNearestX={(value, event) => {
                  setCrosshairData({ x: value.x, y: value.y.toFixed(3) });
                }}
            />
            <Crosshair>
              <div
                style={{
                  backgroundColor: "rgba(0,0,25,0.75)",
                  padding: "5px",
                  borderRadius: "3px",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <div>
                  {props.title}:{crosshairData.y} Time:{crosshairData.x}
                </div>
              </div>
            </Crosshair>
          </XYPlot>
        </Col>
      </div>
    );
  } else {
    return (
      <div ref={myRef}>
        <Col xs={2} style={Styles.BootstrapCenter}>
          <p>{props.title}</p>
        </Col>
        <Col xs={10}>
          <XYPlot
            xType={props.xType}
            size={4}
            height={windowSize.height * props.height}
            width={windowSize.width * props.width}
            animation={modes[0]}
          >
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis />
            <YAxis />
            <MarkSeries
                size={5}
                data={props.data}
                color={color}
                onNearestX={(value, event) => {
                  setCrosshairData({ x: value.x, y: value.y.toFixed(3) });
                }}
            />
          </XYPlot>
        </Col>
      </div>
    );
  }
}
