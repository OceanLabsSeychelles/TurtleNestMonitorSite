import {useEffect,useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import ResponsivePlot from "./components/ResponsivePlot";
import Styles from "./components/Styles";
import {graphDataActions} from "./reducers/graphDataSlice";
import "../node_modules/react-vis/dist/style.css";
import {Offcanvas, Button, ButtonGroup, Card, Col, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { CSVLink } from "react-csv";

export default function History() {
    const dispatch = useDispatch();
    const graphData = useSelector(state => state.graphData);
    const [exportData, setExportData] = useState([]);
    const headers = [
        { label: "Date", key: "d" },
        { label: "Oxygen", key: "o" },
        { label: "Temperature", key: "t" },
        { label: "Humidity", key: "h" },
    ];

    useEffect(() => {
        if(graphData.allLoaded) {
            const flat = graphData.allData.map(entry => {
                return {
                    d: entry.date.replace("measurement-", ""),
                    o: entry.data.oxygen,
                    t: entry.data.temperature,
                    h: entry.data.humidity,
                }
            });
            setExportData(flat)
        }
    }, [graphData.allData, graphData.allLoaded])

  useEffect(() => {
    async function effect() {
      dispatch(graphDataActions.loadDate());
      dispatch(graphDataActions.loadAll());

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

    function renderExportButton(){
        if(exportData.length>0) {
            return (
                <CSVLink
                    data={exportData}
                    headers={headers}
                    filename={`nestExport-${new Date().toJSON()}.csv`}
                    className="btn btn-primary"
                >
                    Export All Data
                </CSVLink>
            )
        }else{
            return(
                <div
                    className="btn btn-primary"
                >
                    Export Data Loading...
                </div>
            )
        }
    }

  return (
    <div className="App" style={Styles.BootstrapCenter}>
      <Col xs={12} >
          <Row
            style={{padding:'2rem'}}
          >
              {renderExportButton()}
          </Row>
          <h3 style={{...Styles.BootstrapCenter, marginTop:"2.5rem"}}>Temperature</h3>
          <ResponsivePlot width={0.8} height={.15} isMobile={false} data={graphData.temperature} />
          <h3 style={Styles.BootstrapCenter}>Oxygen</h3>
          <ResponsivePlot width={0.8} height={.15} isMobile={false} data={graphData.oxygen} />
          <h3 style={Styles.BootstrapCenter}>Humidity</h3>
          <ResponsivePlot width={0.8} height={.15} isMobile={false} data={graphData.humidity} />
          <h3 style={Styles.BootstrapCenter}>Motion Events</h3>
          <ResponsivePlot width={0.8} height={.15} isMobile={false} data={graphData.motion} />
          {renderDateButtons()}
      </Col>
    </div>
  );
}
