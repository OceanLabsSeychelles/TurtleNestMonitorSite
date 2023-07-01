import {useDispatch, useSelector} from "react-redux";
import {queryDives} from "../reducers/divesSlice";
import {fetchSession} from "../reducers/sessionSlice";
import {useEffect, useRef, useState} from "react";
import {Button, Col, Row} from "react-bootstrap";
import {MapContainer} from 'react-leaflet/MapContainer';
import {TileLayer} from 'react-leaflet/TileLayer';
import {Popup} from 'react-leaflet';
import {Marker} from 'react-leaflet/Marker';
import Styles from "../components/Styles";
import {useNavigate} from 'react-router-dom';
import {Grid} from 'react-loader-spinner';
import "./leaflet.css";
export default function DiveMap() {
    const [highlighted, setHighlighted] = useState(null);
    const highlightedRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const dives = useSelector(state => state.dives)
    const session = useSelector(state => state.session)
    const queryRef = useRef(null);
    const loggedIn = useSelector(state => state.auth.loggedIn)
    if(!loggedIn){
        navigate("/login");
        return <></>;
    };

    useEffect(() => {
        if (queryRef.current === true) return;
        if (dives.status === "succeeded") return;
        dispatch(queryDives())
        queryRef.current = true;
    }, []);

    function clusterDives(dives, gridSize) {
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
        const gridSize = 0.01; // Adjust as needed
        const clusters = clusterDives(dives.records, gridSize);
        const colors= ["#55ff00","#00ff00","#0000ff","#ffff00","#00ffff","#ff00ff","#ffffff","#000000"]
        return (
            <Row className="justify-content-between" style={{ margin: ".5rem", width: '90%', alignItems: "flex-start" }}>
                {Object.values(clusters).map((cluster,index) => (
                    cluster.dives.map((dive) => {
                        const dateObject = new Date(dive.datetime);
                        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
                        const formattedDate = dateObject.toLocaleString('en-US', options);
                        return (
                            <Button
                                variant={"dark"}
                                disabled={session.status === "loading"}
                                onClick={async () => {
                                    await dispatch(fetchSession(dive.sessionId));
                                    navigate("/session")
                                }}
                                style={{ margin: ".5rem", backgroundColor: `hsl(${360-index*60} 60% 40%)` }}
                                key={dive.sessionId}
                            >
                                {formattedDate} ({Number(dive.lat).toFixed(6)}, {Number(dive.lon).toFixed(6)})
                            </Button>
                        )
                    })
                ))}
            </Row>
        )
    }


    function RenderMap() {
        if (dives.status !== "succeeded") return (<></>);

        const markers = dives.records.map((dive) => {

            return (
                <Marker
                    eventHandlers={{
                        click: () => {
                            dispatch(fetchSession(dive.sessionId));
                            navigate("/session")
                        },
                    }}
                    key={dive.sessionId}
                    position={[dive.lat, dive.lon]}
                >
                </Marker>
            )
        })

        return (
            <Row style={Styles.BootstrapCenter}>
                <MapContainer center={[dives.records[0].lat, dives.records[0].lon]} zoom={12} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {highlighted &&
                        <Marker
                            position={[highlighted.lat, highlighted.lon]}
                        >
                        </Marker>
                    }
                    { !highlighted && markers }
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
                        <Row
                        style={{
                            height:'90vh',
                            width:"100%",
                            overflowY: 'scroll',
                            alignItems:'center',
                            justifyContent:'center',
                        }}
                    >
                        <RenderDives/>
                        </Row>
                    </Col>
                    <Col>
                        <RenderMap/>
                    </Col>
                </>
            }
        </Row>
    )
}