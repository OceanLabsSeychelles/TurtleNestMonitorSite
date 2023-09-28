import {useDispatch, useSelector} from "react-redux";
import {queryNestDates} from "../reducers/nestSlice";
import {queryNestDate} from "../reducers/nestDateSlice";
import {fetchSession} from "../reducers/sessionSlice";
import {useEffect, useRef, useState} from "react";
import {Button, Col, Row} from "react-bootstrap";
import {MapContainer} from 'react-leaflet/MapContainer';
import {TileLayer} from 'react-leaflet/TileLayer';
import {CircleMarker} from "react-leaflet";
import Styles from "../components/Styles";
import {useNavigate} from 'react-router-dom';
import {Grid} from 'react-loader-spinner';
import FadeIn from "../components/FadeIn";
import "./leaflet.css";
export default function Nest() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const foundDates = useSelector(state => state.nestDates);
    const session = useSelector(state => state.nestDate);
    const queryRef = useRef(null);
    const loggedIn = useSelector(state => state.auth.loggedIn)

    useEffect(() => {
        if(!loggedIn){
            navigate("/login");
        }
    }, [])

    useEffect(() => {
        if (queryRef.current === true) return;
        if (foundDates.status === "succeeded") return;
        dispatch(queryNestDates())
        queryRef.current = true;
    }, []);



    const RenderDates = () => {
        return (
            <Row
                style={{justifyContent: "center"}}
            >
                {foundDates.records.map((record, index) => {
                    return(
                    <label
                        key={record.date}
                        // disabled={session.status === "loading"}
                        onClick={async () => {
                            dispatch(queryNestDate(record));
                        }}
                        style={{
                            cursor:"pointer",
                            margin: ".5rem",
                            padding:"0.5rem",
                            borderRadius:"5px",
                            borderWidth:"2px",
                            borderStyle:"solid",
                            width:"60%",
                            textAlign:"center",

                        }}
                    >
                        {record}
                    </label>
                    )
                })}
            </Row>
        )
    }


    function RenderMap() {
        if (foundDates.status !== "succeeded") return (<></>);
        const clusters = clusterDives(foundDates.records);
        return (
            <Row style={Styles.BootstrapCenter}>
                <MapContainer center={[foundDates.records[0].lat, foundDates.records[0].lon]} zoom={12} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {Object.values(clusters).map((cluster,index) => (
                        cluster.dives.map((dive) => {
                            return (
                                <CircleMarker
                                    key={dive.sessionId}
                                    center={[dive.lat, dive.lon]}
                                    pathOptions={{ color: `hsl(${360-index*60} 60% 40%)`, fillColor: `hsl(${360-index*60} 60% 40%)` }}
                                    radius={5}
                                    eventHandlers={{
                                        click: () => {
                                            dispatch(fetchSession(dive.sessionId));
                                            navigate("/session");
                                        },
                                    }}
                                />
                            );
                        })
                    ))}
                </MapContainer>
            </Row>
        )
    }

    return (
        <Row>
            {foundDates.status === "loading" &&
                <Col className="d-flex flex-column justify-content-center align-items-center" style={{ height: "90vh", paddingBottom:'10rem' }}>
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
                    <h5 style={{color:"rgb(128,193,108)", marginTop:'2rem'}}>Nest Records Loading</h5>

                </Col>


            }
            {foundDates.status === "succeeded" &&
                <>
                    <Col>
                        <FadeIn>
                            <Row
                                style={{
                                    height:'82vh',
                                    width:"100%",
                                    overflowY: 'scroll',
                                    alignItems:'center',
                                    justifyContent:'center',
                                }}
                            >
                                <RenderDates/>
                            </Row>
                            <Row style={{ alignItems:'center', justifyContent:'center',}}>
                                <Button
                                    variant={"success"}
                                    style={{width:"50%"}}
                                    onClick={()=>{
                                        dispatch(queryNestDates());
                                    }}
                                >
                                    Re-Load Records
                                </Button>
                            </Row>
                        </FadeIn>
                    </Col>
                    <Col>
                        <FadeIn>
                            <h3>Session Data</h3>
                            {JSON.stringify(session)}
                        </FadeIn>
                    </Col>
                </>
            }
        </Row>
    )
}