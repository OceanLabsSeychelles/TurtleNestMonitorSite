import {useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import Styles from "../components/Styles";
import {graphDataActions} from "../reducers/graphDataSlice";
import "react-vis/dist/style.css";
import {Card, Col} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
const {useNavigate} = require("react-router-dom");

export default function Live() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const graphData = useSelector(state => state.graphData)
    const loggedIn = useSelector(state => state.auth.loggedIn)
    useEffect(() => {
        if(!loggedIn){
            navigate("/login");
        }
    }, [])

    useEffect(() => {
        async function effect() {
            dispatch(graphDataActions.loadLive())
        }

        effect();
        setInterval(()=>{
            effect();
        }, 2000)
    }, []);

    return (
        <div className="App" style={{...Styles.BootstrapCenter, height:"92vh",backgroundColor:"rgb(128,193,108)"}}>
            <Col xs={12} >
                    <Card className={'bg-light'} style={{padding:'1em',margin:'3em'}}>
                        <Card.Body style={{textAlign: 'center'}}>
                            <Card.Title><h2>Temperature</h2></Card.Title>
                            <Card.Text>
                                <h4>{graphData.live.temperature.toFixed(2)}  deg C </h4>
                            </Card.Text>
                        </Card.Body>
                    </Card>

                <Card className={'bg-light'} style={{padding:'1em',margin:'3em'}}>
                    <Card.Body style={{textAlign: 'center'}}>
                        <Card.Title><h2>Oxygen</h2></Card.Title>
                        <Card.Text>
                            <h4>{graphData.live.oxygen.toFixed(2)}  % </h4>
                        </Card.Text>
                    </Card.Body>
                </Card>

                <Card className={'bg-light'} style={{padding:'1em',margin:'3em'}}>
                    <Card.Body style={{textAlign: 'center'}}>
                        <Card.Title><h2>Humidity</h2></Card.Title>
                        <Card.Text>
                            <h4>{graphData.live.humidity.toFixed(2)}  % </h4>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </div>
    );
}
