import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import { Form, Button, Card, Container } from 'react-bootstrap';
import Styles from "../components/Styles";
import { useDispatch, useSelector } from "react-redux";
import {login} from "../reducers/authSlice";
import FadeIn from "../components/FadeIn";
function Login() {
    const loggedIn = useSelector(state => state.auth.loggedIn);
    const users = JSON.parse(process.env.REACT_APP_USERS);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        let loginSuccess = false;
        e.preventDefault();
        users.forEach((user) => {
            if(username === user.name && password===user.password){
                loginSuccess = true;
                dispatch(login());
                navigate("/dives");
            }
        });
        if(!loginSuccess){
            alert("Invalid credentials.");
        }
    };

    useEffect(() => {
        if(loggedIn){
            navigate("/dives");
        }
    }, [])


    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <FadeIn>
            <Card className="w-100" style={{ maxWidth: "400px" }}>
                <Card.Body>
                    <div
                        style={Styles.BootstrapCenter}
                    >
                    <img
                        src={"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fjobo.sc%2Fwp-content%2Fuploads%2F2019%2F03%2FNature_Seychelles_Logo_270px.png&f=1&nofb=1&ipt=416c280ffa82404a0523d9fe9bce58fcbd425f5f981786d606a672aea7188a22&ipo=images"}
                        width="130"
                        height="100"
                    />
                    </div>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" required value={username} onChange={e => setUsername(e.target.value)} />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                        </Form.Group>
                        <br />
                        <Button variant="success" className="w-100" type="submit">Log In</Button>
                    </Form>
                </Card.Body>
            </Card>
            </FadeIn>
        </Container>
    );
}

export default Login;
