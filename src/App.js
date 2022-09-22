import {useState, useEffect, useMemo} from "react";
import { useSelector, useDispatch } from "react-redux";
import ResponsivePlot from "./components/ResponsivePlot";
import Styles from "./components/Styles";
import {graphDataActions} from "./reducers/graphDataSlice";
import "../node_modules/react-vis/dist/style.css";
import {Badge, Button, ButtonGroup, Card, Col, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

export default function App() {
  const dispatch = useDispatch();
  const graphData = useSelector(state => state.graphData)

  useEffect(() => {
    async function effect() {
      dispatch(graphDataActions.loadDate());
    }
    effect();
  }, [graphData.date]);

    function renderDateButtons() {
        const ProbeVariant = {state:"primary"}
        return (
            <Col style={Styles.BootstrapCenter}>
            <Row>
                <ButtonGroup style={{alignItems: "center"}}>
                    <Button
                        variant={ProbeVariant.state}
                        onClick={() => {
                            dispatch(graphDataActions.decrementDate())
                        }}
                    >
                        {"<"}
                    </Button>
                    <Button variant={ProbeVariant.state}>{graphData.fetchableDate}</Button>
                    <Button
                        variant={ProbeVariant.state}
                        onClick={() => {
                            dispatch(graphDataActions.incrementDate())
                        }}
                    >
                        {">"}
                    </Button>
                </ButtonGroup>
            </Row>
            </Col>
        )
    }

  return (
    <div className="App" style={Styles.BootstrapCenter}>
      <Col xs={12}>
          <h3 style={Styles.BootstrapCenter}>Temperature</h3>
          <ResponsivePlot width={0.8} height={.225} isMobile={false} data={graphData.temperature} />
          <h3 style={Styles.BootstrapCenter}>Oxygen</h3>
          <ResponsivePlot width={0.8} height={.225} isMobile={false} data={graphData.oxygen} />
          <h3 style={Styles.BootstrapCenter}>Humidity</h3>
          <ResponsivePlot width={0.8} height={.225} isMobile={false} data={graphData.humidity} />
          {renderDateButtons()}
      </Col>
    </div>
  );
}
