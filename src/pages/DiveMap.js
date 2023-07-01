import {useDispatch, useSelector} from "react-redux";
import {queryDives} from "../reducers/divesSlice";
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
export default function DiveMap() {
    const [highlighted, setHighlighted] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const dives = useSelector(state => state.dives)
    const session = useSelector(state => state.session)
    const queryRef = useRef(null);
    const loggedIn = useSelector(state => state.auth.loggedIn)

    useEffect(() => {
        if(!loggedIn){
            navigate("/login");
        }
    }, [])

    useEffect(() => {
        if (queryRef.current === true) return;
        if (dives.status === "succeeded") return;
        dispatch(queryDives())
        queryRef.current = true;
    }, []);

    function clusterDives(dives) {
        const gridSize = 0.01;
        const clusters = {};

        for (const dive of dives) {
            const gridX = Math.floor(dive.lat / gridSize);
            const gridY = Math.floor(dive.lon / gridSize);
            const key = `${gridX},${gridY}`;

            if (!clusters[key]) {
                clusters[key] = {
                    dives: [],
                    color: `hsl(${Math.random() * 360}, 100%, 75%)`, // Generate random color
                };
            }

            clusters[key].dives.push(dive);
        }

        return clusters;
    }


    const RenderDives = () => {
        const clusters = clusterDives(dives.records);
        return (
            <Row
                 style={{justifyContent: "center"}}
            >
                {Object.values(clusters).map((cluster,index) => (
                    cluster.dives.map((dive) => {
                        const dateObject = new Date(dive.datetime);
                        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
                        const formattedDate = dateObject.toLocaleString('en-US', options);
                        return (
                            <div
                                key={dive.sessionId}
                                // disabled={session.status === "loading"}
                                onClick={async () => {
                                    if(session.status === "loading") return;
                                    await dispatch(fetchSession(dive.sessionId));
                                    navigate("/session")
                                }}
                                style={{
                                    margin: ".5rem",
                                    padding:"0.5rem",
                                    borderRadius:"5px",
                                    borderWidth:"2px",
                                    borderStyle:"solid",
                                    borderColor:session.status==="loading"?`hsl(${360-index*60} 60% 90%)`:`hsl(${360-index*60} 60% 40%)`,
                                    backgroundColor:session.status==="loading"?`hsl(${360-index*60} 60% 95%)`:`hsl(${360-index*60} 60% 90%)`,
                                    width:"60%",
                                }}
                            >
                                {formattedDate} ({Number(dive.lat).toFixed(6)}, {Number(dive.lon).toFixed(6)})
                            </div>
                        )
                    })
                ))}
            </Row>
        )
    }


    function RenderMap() {
        if (dives.status !== "succeeded") return (<></>);
        const clusters = clusterDives(dives.records);
        return (
            <Row style={Styles.BootstrapCenter}>
                <MapContainer center={[dives.records[0].lat, dives.records[0].lon]} zoom={12} scrollWheelZoom={false}>
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
            {dives.status === "loading" &&
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
                    <h5 style={{color:"rgb(128,193,108)", marginTop:'2rem'}}>Dive Record Loading</h5>

                </Col>


            }
            {dives.status === "succeeded" &&
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
                        <RenderDives/>
                        </Row>
                        <Row style={{ alignItems:'center', justifyContent:'center',}}>
                        <Button
                            variant={"success"}
                            style={{width:"50%"}}
                            onClick={()=>{
                                dispatch(queryDives())
                            }}
                        >
                            Re-Load Dives
                        </Button>
                        </Row>
                        </FadeIn>
                    </Col>
                    <Col>
                        <FadeIn>
                            <RenderMap/>
                        </FadeIn>
                    </Col>
                </>
            }
        </Row>
    )
}