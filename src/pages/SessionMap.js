import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {ToggleButton, Col, Row} from "react-bootstrap";
import ResponsivePlot from "../components/ResponsivePlot";
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { Marker } from 'react-leaflet/Marker'
import {Popup} from "react-leaflet";
import "./leaflet.css";
import Styles from "../components/Styles";
import {useNavigate} from "react-router-dom";
import {CSVLink} from "react-csv";

export default function SessionMap(){
    const navigate = useNavigate();
    const [depth, setDepth] = useState(false);
    const session = useSelector(state => state.session)
    const loggedIn = useSelector(state => state.auth.loggedIn)
    const csvHeaders = [
        {label: "Index", key:"recordIndex"},
        {label: "Time", key: "datetime"},
        {label: "Runtime", key: "runtime"},
        {label: "Latitude", key: "lat"},
        {label: "Longitude", key: "lon"},
        {label: "Temperature", key: "temperature"},
        {label: "pH", key: "ph"},
        {label: "Dissolved Oxygen", key: "do"},
        {label: "Light", key: "light"},
        {label: "Depth", key: "depth"},
        {label: "Pressure", key: "pressure"},
        {label: "GPS Fix", key: "fix"},
        {label: "GPS Sats", key: "sats"},
    ];


    useEffect(() => {
        if(!loggedIn){
            navigate("/login");
        }
        if(session.status !== "succeeded"){
            navigate("/dives")
        }
    }, [])

    function timeSeries(key) {
        return session.records.map(obj => {
            const dt = new Date(obj.datetime)
            const finalTime = new Date(dt.getTime() + (obj.runtime * 1000));
            return{x:finalTime,y:obj[key]}
        });
    }

    function depthSeries(key) {
        return session.records.map(obj => {
            return { x: obj.depth, y: obj[key] };
        }).sort((a, b) => a.x - b.x);
    }

    function RenderPlot({dataKey}){
        if(!depth || dataKey === 'depth'){
            const data = timeSeries(dataKey);
            return (
                <ResponsivePlot width={0.45} height={.25} xtitle="Time" isMobile={false} xType={"time"} data={data}/>
            )
        }else{
            const data = depthSeries(dataKey);
            return(
                <ResponsivePlot width={0.45} height={.25} xtitle="Depth(m)" isMobile={false} xType={"linear"} data={data} />
            )
        }

    }


    if (session.status !== "succeeded") return(<></>);
    const ingress   = {lat:session.records[0].lat,lon:session.records[0].lon};
    const egress = {lat:session.records[session.records.length-1].lat,lon:session.records[session.records.length-1].lon};
    const date = new Date(session.records[0].datetime);

    return(
        <Row>
            <CSVLink
                style={{
                    borderWidth:"0px",

                }}
                className="btn btn-outline-success"
                data={session.records}
                headers={csvHeaders}
                filename={`dreamExport-${new Date().toJSON()}.csv`}
            >
                Export : {date.toString()}

            </CSVLink>
            <Col style={Styles.BootstrapCenter}>
                <MapContainer center={[ingress.lat, ingress.lon]} zoom={18} maxZoom={25} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[egress.lat, egress.lon]}>
                        <Popup>
                            Egress
                        </Popup>
                    </Marker>
                    <Marker position={[ingress.lat, ingress.lon]}>
                        <Popup>
                            Ingress
                        </Popup>
                    </Marker>
                </MapContainer>
            </Col>
            <Col
                style={{
                    height:'90vh',
                    width:"50%",
                    overflowY: 'scroll',
                    alignItems:'center',
                    justifyContent:'center',
                    padding:'1rem'
                }}
            >
                <ToggleButton
                    style={{...Styles.BootstrapCenter, marginLeft:"25%", marginRight:"25%"}}
                    className="mb-2"
                    id="toggle-check"
                    type="checkbox"
                    variant="outline-success"
                    checked={depth}
                    value="1"
                    onChange={(e) => setDepth(e.currentTarget.checked)}
                >
                    {!depth ? "View as depth series" : "View as time series"}
                </ToggleButton>
                <h3 style={{textAlign:"center", paddingTop:"1rem"}}>Depth</h3>
                <RenderPlot dataKey={"depth"}/>
                <h3 style={{textAlign:"center", paddingTop:"1rem"}}>Temperature</h3>
                <RenderPlot dataKey={"temperature"}/>
                <h3 style={{textAlign:"center", paddingTop:"1rem"}}>Pressure</h3>
                <RenderPlot dataKey={"pressure"}/>
                <h3 style={{textAlign:"center", paddingTop:"1rem"}}>pH</h3>
                <RenderPlot dataKey={"ph"}/>
                <h3 style={{textAlign:"center", paddingTop:"1rem"}}>Light</h3>
                <RenderPlot dataKey={"light"}/>
                <h3 style={{textAlign:"center", paddingTop:"1rem"}}>Oxygen</h3>
                <RenderPlot dataKey={"do"}/>
            </Col>
        </Row>
    )
}