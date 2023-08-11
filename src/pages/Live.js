import {useEffect, useRef} from "react";
import { useSelector, useDispatch } from "react-redux";
import Styles from "../components/Styles";
import {graphDataActions} from "../reducers/graphDataSlice";
import "react-vis/dist/style.css";
import "bootstrap/dist/css/bootstrap.css";
const {useNavigate} = require("react-router-dom");
import {queryRecent} from "../reducers/nestRecentSlice";
import {queryUniqueDates} from "../reducers/nestHistorySlice";
import FadeIn from "../components/FadeIn";
import {Col, Row} from "react-bootstrap";
import {graphQuery} from "../reducers/nestGraphSlice";
import ResponsivePlot from "../components/ResponsivePlot";

export default function Live() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const nestRecent = useSelector(state => state.nestRecent)
    const nestHistory = useSelector(state => state.nestHistory);
    const loggedIn = useSelector(state => state.auth.loggedIn)
    const nestGraph = useSelector(state => state.nestGraph);
    const nestRecentQuery = useRef(null);
    const nestHistoryQuery = useRef(null);

    useEffect(() => {
        if (nestRecentQuery.current === true) return;
        if (nestRecent.status === "succeeded") return;
        dispatch(queryRecent())
        nestRecentQuery.current = true;
    }, []);

    useEffect(() => {
        if (nestHistoryQuery.current === true) return;
        if (nestRecent.status === "succeeded") return;
        dispatch(queryUniqueDates())
        nestHistoryQuery.current = true;
    }, [])

    useEffect(() => {
        if(!loggedIn){
            navigate("/login");
        }
    }, [])

    const RenderDates = () => {
        return nestHistory.records.map((record, index) => {
            const dateObj = new Date(record);
            const fullDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            return (
                <Row
                    key={record}
                    style={{justifyContent: "center"}}
                >
                    <label
                        onClick={async () => {
                            dispatch(graphQuery(record));
                            console.log(nestGraph);
                        }}
                        style={{
                            cursor:"pointer",
                            margin: ".5rem",
                            padding:"0.5rem",
                            borderRadius:"5px",
                            borderWidth:"2px",
                            borderStyle:"solid",
                            backgroundColor:"rgb(218,229,215)",
                            borderColor:"rgb(119,152,109)",
                            width:"60%",
                        }}
                    >
                        {fullDate}
                    </label>
                </Row>
            )
    })}

    function timeSeries(key) {
        return nestGraph.records.map(obj => {
            const dt = new Date(obj.datetime)
            return{x:dt,y:obj[key]}
        });
    }

    const RenderPlot = (props) => {
        const data = timeSeries(props.dataKey);
        return (
            <ResponsivePlot width={0.70} height={.135} xtitle="Time" isMobile={false} xType={"time"} data={data}/>
        )
    }

    return (
        <Row>
            <FadeIn>
                <Col
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: "rgb(128,193,108)",
                    }}
                >
                {nestRecent.status === 'succeeded' &&
                    <>
                        <Row style={{padding:".5rem"}}>
                            <Col style={Styles.BootstrapCenter}>
                                {new Date(nestRecent.recent.datetime).toLocaleDateString()}
                                {" at "}
                                {new Date(nestRecent.recent.datetime).toLocaleTimeString()}
                            </Col>
                            <Col style={Styles.BootstrapCenter}>Temp: {nestRecent.recent.temperature.toFixed(2)} °C</Col>
                            <Col style={Styles.BootstrapCenter}>Humidity: {nestRecent.recent["humidity_median"]}</Col>
                            <Col style={Styles.BootstrapCenter}>Oxygen: {nestRecent.recent.oxygen.toFixed(2)} %</Col>
                            <Col style={Styles.BootstrapCenter}>Motion: {nestRecent.recent["motion_sd"].toFixed(2)} G</Col>
                        </Row>
                    </>
                }
                </Col>
                {nestHistory.status === 'succeeded' &&
                    <Row>
                        <Col lg={3} style={{
                            height:'87vh',
                            overflowY:'scroll',
                        }}>
                            <RenderDates />
                        </Col>
                        <Col lg={9} style={{
                            backgroundColor:nestGraph.status==="succeeded"?"rgb(250,250,250)":"rgba(227,227,227,0.75)",
                            height:'87vh',
                            borderRadius:"5px",
                            alignItems:"center",
                            justifyContent:"center",
                            ...Styles.BootstrapCenter
                        }}>
                            {nestGraph.status !== 'succeeded' &&
                                <h5>Select a date on the left to view data.</h5>
                            }
                            {nestGraph.status === 'succeeded' &&
                                <Col>
                                <h3 style={{textAlign:"center", paddingTop:"1rem"}}>Temperature</h3>
                                <RenderPlot dataKey={"temperature"}/>
                                <h3 style={{textAlign:"center", paddingTop:"1rem"}}>Oxygen</h3>
                                <RenderPlot dataKey={"oxygen"}/>
                                <h3 style={{textAlign:"center", paddingTop:"1rem"}}>Humidity</h3>
                                <RenderPlot dataKey={"humidity_median"}/>
                                <h3 style={{textAlign:"center", paddingTop:"1rem"}}>Motion</h3>
                                <RenderPlot dataKey={"motion_sd"}/>
                                </Col>
                            }
                        </Col>
                    </Row>
                }
            </FadeIn>
        </Row>

    );
}
