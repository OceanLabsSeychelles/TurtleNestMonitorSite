import {useEffect,useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import ResponsivePlot from "./components/ResponsivePlot";
import Styles from "./components/Styles";
import {graphDataActions} from "./reducers/graphDataSlice";
import "../node_modules/react-vis/dist/style.css";
import {Offcanvas, Button, ButtonGroup, Card, Col, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

export default function App() {
  const dispatch = useDispatch();
  const graphData = useSelector(state => state.graphData)
    const [show, setShow] = useState(true);
  useEffect(() => {
    async function effect() {
      dispatch(graphDataActions.loadDate());
    }
    effect();
  }, [graphData.date]);

    function renderDateButtons() {
        const ProbeVariant = (graphData.loading)?{state:"outline-primary"} : {state:"primary"}
        return (
            <Col style={Styles.BootstrapCenter}>
            <Row >
                <ButtonGroup style={{alignItems: "center"}}>
                    <Button
                        disabled={graphData.loading}
                        variant={"outline-primary"}
                        onClick={() => {
                            dispatch(graphDataActions.decrementDate())
                        }}
                    >
                        {"<"}
                    </Button>
                    <Button variant={ProbeVariant.state}>{graphData.fetchableDate}</Button>
                    <Button
                        disabled={graphData.loading}
                        variant={"outline-primary"}
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

    function StaticExample() {
        return (
            <Offcanvas show={graphData.noData} placement={"top"}>
                <Offcanvas.Header style={{margin:"0rem"}}>
                    <Offcanvas.Title>No Data Found</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Col>
                    <Row style={{margin:"2rem"}}>
                    <Button
                        onClick={()=>{dispatch(graphDataActions.setNoData(false))}}
                        variant={"danger"}>Got it.</Button>
                    </Row>
                    </Col>
                </Offcanvas.Body>
            </Offcanvas>
        );
    }

  return (
    <div className="App" style={Styles.BootstrapCenter}>
      <Col xs={12} >
          {StaticExample()}
          <h3 style={{...Styles.BootstrapCenter, marginTop:"2.5rem"}}>Temperature</h3>
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
