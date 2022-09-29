import {useEffect,useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import ResponsivePlot from "./components/ResponsivePlot";
import Styles from "./components/Styles";
import {graphDataActions} from "./reducers/graphDataSlice";
import "../node_modules/react-vis/dist/style.css";
import {Offcanvas, Button, ButtonGroup, Card, Col, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

export default function Live() {
    const dispatch = useDispatch();
    const graphData = useSelector(state => state.graphData)
    const [show, setShow] = useState(true);

    useEffect(() => {
        async function effect() {
            dispatch(graphDataActions.loadLive());
        }
        effect();
        setInterval(()=>{
            effect();
        }, 10000)
    }, []);

    return (
        <div className="App" style={Styles.BootstrapCenter}>
            <Col xs={12} >
                    <Card className={'bg-light'} style={{padding:'1em',margin:'3em'}}>
                        <Card.Body style={{textAlign: 'center'}}>
                            <Card.Title><h2>Temperature</h2></Card.Title>
                            <Card.Text>
                                <h4>{graphData.live.temperature.toFixed(1)}  deg C </h4>
                            </Card.Text>
                        </Card.Body>
                    </Card>

                <Card className={'bg-light'} style={{padding:'1em',margin:'3em'}}>
                    <Card.Body style={{textAlign: 'center'}}>
                        <Card.Title><h2>Oxygen</h2></Card.Title>
                        <Card.Text>
                            <h4>{graphData.live.oxygen.toFixed(1)}  % </h4>
                        </Card.Text>
                    </Card.Body>
                </Card>

                <Card className={'bg-light'} style={{padding:'1em',margin:'3em'}}>
                    <Card.Body style={{textAlign: 'center'}}>
                        <Card.Title><h2>Humidity</h2></Card.Title>
                        <Card.Text>
                            <h4>{graphData.live.humidity.toFixed(1)}  % </h4>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </div>
    );
}
