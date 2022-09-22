import "./styles.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTodoAsync, addTodoAsync, showTodo } from "./features/todoSlice";
import ResponsivePlot from "./components/ResponsivePlot";
import Styles from "./components/Styles";
import "../node_modules/react-vis/dist/style.css";

async function getDb() {
  let response = await fetch(
    'https://sfasurf-8806.restdb.io/rest/tnmd?q={"date": "2022-01-01"}',
    {
      headers: {
        "X-API-KEY": "629678a3c4d5c3756d35a40e",
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
  );

  let data = await response.json();
  return data;
}

export default function App() {
  const todo = useSelector(showTodo);
  const dispatch = useDispatch();
  const [newTodo, setNewTodo] = useState({
    userId: 69,
    id: 69,
    title: "",
    completed: false
  });
  const [fetchData, setFetchData] = useState([]);

  const addNewTodo = () => {
    dispatch(addTodoAsync(newTodo));
  };

  useEffect(() => {
    async function effect() {
      const newData = await getDb();
      const rawData = newData["0"].data;
      const lineData = [];
      rawData.forEach((point, index) => {
        lineData.push({ x: index, y: point.temperature });
      });
      setFetchData(lineData);
    }
    effect();
  }, []);

  return (
    <div className="App" style={Styles.BootstrapCenter}>
      <ResponsivePlot isMobile={false} data={fetchData} color={"red"} />
    </div>
  );
}
