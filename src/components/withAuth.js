import {useSelector} from "react-redux";
export default function WithAuth(props) {
    const isLoggedIn = useSelector((state) => state.auth.loggedIn);
    if (isLoggedIn) {
        return props.children;
    }else{
        return null;
    }
}