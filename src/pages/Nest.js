import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {queryNestDates} from "../reducers/nestSlice";
import {queryNestDate} from "../reducers/nestDateSlice";
import {useEffect, useRef} from "react";
import {Button, Col, Row} from "react-bootstrap";
import {useNavigate} from 'react-router-dom';
import {Grid} from 'react-loader-spinner';
import FadeIn from "../components/FadeIn";
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import "./leaflet.css";
import {CSVLink} from "react-csv";
import Styles from "../components/Styles";
import ResponsivePlot from "../components/ResponsivePlot";

export default function Nest() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const foundDates = useSelector(state => state.nestDates);
    const session = useSelector(state => state.nestDate);
    const queryRef = useRef(null);
    const loggedIn = useSelector(state => state.auth.loggedIn)
    const [flatData, setFlatData] = useState([]);

    const headers = [
        {label: "Date", key: "d"},
        {label: "Oxygen", key: "o"},
        {label: "Temperature", key: "t"},
        {label: "Humidity", key: "h"},
        {label: "Motion", key: "m"}
    ];

    useEffect(() => {
        if(session.status=== "succeeded"){
            const flat = session.records.map(entry => {
                return {
                    d: entry.datetime,
                    o: entry.oxygen,
                    t: entry.temperature,
                    h: entry.humidity_median,
                    m: entry.motion_sd,
                }
            });
            setFlatData(flat);
            console.log(flat);
        }
    }, [session.status])

    useEffect(() => {
        if (!loggedIn) {
            navigate("/login");
        }
    }, [])

    useEffect(() => {
        if (queryRef.current === true) return;
        if (foundDates.status === "succeeded") return;
        dispatch(queryNestDates())
        queryRef.current = true;
    }, []);

    function renderExportButton() {
        if (flatData.length > 0) {
            return (
                <CSVLink
                    data={flatData}
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

    function timeSeries(key) {
        const startTime = new Date(session.records[0].datetime);
        return session.records.map(obj => {
            const finalTime = new Date(startTime.getTime() + (obj.runtime * 1000));
            return{x:new Date(obj.datetime),y:obj[key]}
        });
    }

    function RenderPlot({dataKey}){
            const data = timeSeries(dataKey);
            console.log(data);
            return (
                <ResponsivePlot width={0.6} height={.15} xtitle="Time" isMobile={false} xType={"time"} data={data}/>
            )
    }


    const RenderDates = () => {
        return (
            <Row
                style={{justifyContent: "center"}}
            >
                {foundDates.records.map((record, index) => {
                    return (
                        <label
                            key={record.date}
                            // disabled={session.status === "loading"}
                            onClick={async () => {
                                dispatch(queryNestDate(record));
                            }}
                            style={{
                                cursor: "pointer",
                                margin: ".5rem",
                                padding: "0.5rem",
                                borderRadius: "5px",
                                borderWidth: "2px",
                                borderStyle: "solid",
                                width: "60%",
                                textAlign: "center",

                            }}
                        >
                            {record}
                        </label>
                    )
                })}
            </Row>
        )
    }

    const endDate = new Date();  // today's date
    const startDate = new Date();  // make a copy of today's date
    startDate.setMonth(endDate.getMonth() - 6);

    return (
        <Row>
            {foundDates.status === "loading" &&
                <Col className="d-flex flex-column justify-content-center align-items-center"
                     style={{height: "90vh", paddingBottom: '10rem'}}>
                    <Grid
                        height="100"
                        width="100"
                        color="rgb(128,193,108)"
                        ariaLabel="grid-loading"
                        radius="12.5"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    />
                    <h5 style={{color: "rgb(128,193,108)", marginTop: '2rem'}}>Nest Records Loading</h5>

                </Col>


            }
            {foundDates.status === "succeeded" &&
                <>
                    <Col xl={3} style={{
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "ghostwhite",
                        height: "87vh",
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "center",
                    }}>
                        <Row style={{
                            width: "65%",
                            alignSelf: "center",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "2rem",
                            padding: "2rem",
                        }}>
                            <CalendarHeatmap
                                horizontal={false}
                                startDate={startDate}
                                endDate={endDate}
                                values={foundDates.records.map((record, index) => {
                                    return {date: record, count: 1}
                                })}
                                onClick={(value) => {
                                    dispatch(queryNestDate(value.date));
                                }}
                            />
                        </Row>

                        <Row style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: "75%",
                        }}>
                            <Button
                                variant={"success"}
                                style={{width: "50%"}}
                                onClick={() => {
                                    dispatch(queryNestDates());
                                }}
                            >
                                Re-Load Records
                            </Button>
                        </Row>
                    </Col>
                    <Col
                        style={{
                            height: "87vh",
                            overflowY: 'scroll',
                        }}
                    >
                            <h3>Session Data</h3>
                        {session.status === "succeeded" &&
                            <FadeIn>
                            <h3 style={{textAlign:"center", paddingTop:"1rem"}}>Temperature</h3>
                            <RenderPlot dataKey={"temperature"}/>

                            <h3 style={{textAlign:"center", paddingTop:"1rem"}}>Humidity</h3>
                            <RenderPlot dataKey={"humidity_median"}/>

                            <h3 style={{textAlign:"center", paddingTop:"1rem"}}>Oxygen</h3>
                            <RenderPlot dataKey={"oxygen"}/>

                            <h3 style={{textAlign:"center", paddingTop:"1rem"}}>Motion</h3>
                            <RenderPlot dataKey={"motion_sd"}/>
                            {renderExportButton()}
                            </FadeIn>
                        }
                    </Col>
                </>
            }
        </Row>
    )
}