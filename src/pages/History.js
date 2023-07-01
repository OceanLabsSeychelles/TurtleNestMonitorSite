import {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import ResponsivePlot from "../components/ResponsivePlot";
import Styles from "../components/Styles";
import {graphDataActions} from "../reducers/graphDataSlice";
import "react-vis/dist/style.css";
import {Offcanvas, Button, ButtonGroup, Card, Col, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import {CSVLink} from "react-csv";
import {useNavigate} from "react-router-dom";

export default function History() {
    const navigate = useNavigate();
    const loggedIn = useSelector(state => state.auth.loggedIn);
    const dispatch = useDispatch();
    const graphData = useSelector(state => state.graphData);
    const [exportData, setExportData] = useState([]);
    const headers = [
        {label: "Date", key: "d"},
        {label: "Oxygen", key: "o"},
        {label: "Temperature", key: "t"},
        {label: "Humidity", key: "h"},
    ];

    useEffect(() => {
        if(!loggedIn){
            navigate("/login");
        }
    }, [])

    useEffect(() => {
        if (graphData.allLoaded) {
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
        }

        effect();
    }, [graphData.date]);

    useEffect(() => {
        dispatch(graphDataActions.loadAll());
    }, [])

    function renderDateButtons() {
        const ProbeVariant = (graphData.loading) ? {state: "outline-primary"} : {state: "primary"}
        return (
            <Col style={Styles.BootstrapCenter}>
                <Row>
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

    function renderExportButton() {
        if (exportData.length > 0) {
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
        } else {
            return (
                <div
                    className="btn btn-secondary"
                >
                    Export Data Loading...
                </div>
            )
        }
    }

    return (
        <div className="App" style={Styles.BootstrapCenter}>
            <Col xs={12}>
                <h3 style={{...Styles.BootstrapCenter}}>Temperature</h3>
                <ResponsivePlot xType="time" width={0.8} height={.25} isMobile={false} data={graphData.temperature}/>
                <h3 style={Styles.BootstrapCenter}>Oxygen</h3>
                <ResponsivePlot xType="time" width={0.8} height={.25} isMobile={false} data={graphData.oxygen}/>
                <h3 style={Styles.BootstrapCenter}>Humidity</h3>
                <ResponsivePlot xType="time" width={0.8} height={.25} isMobile={false} data={graphData.humidity}/>
                <h3 style={Styles.BootstrapCenter}>Motion Events</h3>
                <ResponsivePlot xType="time" width={0.8} height={.25} isMobile={false} data={graphData.motion}/>
                {renderDateButtons()}
                <Row
                    style={{paddingLeft: "30%", paddingRight: "30%", marginTop: "1rem"}}
                >
                    {renderExportButton()}
                </Row>
            </Col>
        </div>
    );
}
