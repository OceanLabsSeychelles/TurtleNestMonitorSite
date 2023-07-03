import {useDispatch, useSelector} from "react-redux";
import {queryDives} from "../reducers/divesSlice";
import {useEffect} from "react";
import {Button, Col, Row} from "react-bootstrap";
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

    function depthSeries(key){
        return session.records.map(obj => {
            return{x:obj.depth,y:obj[key]}
        });
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
            <h3 style={{textAlign:"center", paddingTop:"1rem"}}>Temperature</h3>
                <ResponsivePlot width={0.45} height={.25} xtitle="Time" isMobile={false} xType={"time"} data={timeSeries("temperature")} />
                {/*<ResponsivePlot width={0.4} height={.25} xtitle="Depth(m)" isMobile={false} xType={"ordinal"} data={depthSeries("temperature")} />*/}
            <h3 style={{textAlign:"center", paddingTop:"1rem"}}>Pressure</h3>
                <ResponsivePlot width={0.45} height={.25} xtitle="Time" isMobile={false} xType={"time"} data={timeSeries("pressure")} />
                {/*<ResponsivePlot width={0.4} height={.25} xtitle="Depth(m)" isMobile={false} xType={"ordinal"} data={depthSeries("pressure")} />*/}
            <h3 style={{textAlign:"center", paddingTop:"1rem"}}>pH</h3>
                <ResponsivePlot width={0.45} height={.25} xtitle="Time" isMobile={false} xType={"time"} data={timeSeries("ph")} />
                {/*<ResponsivePlot width={0.4} height={.25} xtitle="Depth(m)" isMobile={false} xType={"ordinal"} data={depthSeries("ph")} />*/}
            <h3 style={{textAlign:"center", paddingTop:"1rem"}}>Light</h3>
                <ResponsivePlot width={0.45} height={.25} xtitle="Time" isMobile={false} xType={"time"} data={timeSeries("light")} />
                {/*<ResponsivePlot width={0.4} height={.25} xtitle="Depth(m)" isMobile={false} xType={"ordinal"} data={depthSeries("light")} />*/}
            <h3 style={{textAlign:"center", paddingTop:"1rem"}}>Depth</h3>
                <ResponsivePlot width={0.45} height={.25} xtitle="Time" isMobile={false} xType={"time"} data={timeSeries("depth")} />
                {/*<ResponsivePlot width={0.4} height={.25} xtitle="Depth(m)" isMobile={false} xType={"ordinal"} data={depthSeries("depth")} />*/}
            <h3 style={{textAlign:"center", paddingTop:"1rem"}}>Oxygen</h3>
                <ResponsivePlot width={0.45} height={.25} xtitle="Time" isMobile={false} xType={"time"} data={timeSeries("do")} />
                {/*<ResponsivePlot width={0.4} height={.25} xtitle="Depth(m)" isMobile={false} xType={"ordinal"} data={depthSeries("do")} />*/}

            </Col>
        </Row>
    )
}