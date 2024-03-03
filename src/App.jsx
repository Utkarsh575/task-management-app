import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Board from "./components/Board/Board";
// import data from '../data'
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import Editable from "./components/Editable/Editable";
import axios from "axios";
import useLocalStorage from "use-local-storage";
import "../bootstrap.css";
import { useToken } from "./store/store";
import Auth from "./components/Auth";
function App() {
  // const [data, setData] = useState(
  //   localStorage.getItem("kanban-board")
  //     ? JSON.parse(localStorage.getItem("kanban-board"))
  //     : []
  // );

  // console.log(data);

  const defaultDark = window.matchMedia(
    "(prefers-colors-scheme: dark)"
  ).matches;
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light"
  );

  const switchTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const setName = (title, bid) => {
    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data];
    tempData[index].boardName = title;
    setData(tempData);
  };

  // const dragCardInSameBoard = (source, destination) => {
  //   let tempData = Array.from(data);
  //   console.log("Data", tempData);
  //   const index = tempData.findIndex(
  //     (item) => item.id.toString() === source.droppableId
  //   );
  //   console.log(tempData[index], index);
  //   let [removedCard] = tempData[index].card.splice(source.index, 1);
  //   tempData[index].card.splice(destination.index, 0, removedCard);
  //   setData(tempData);
  // };

  const addCard = (title, bid) => {
    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data];
    console.log("add card", tempData[index]);
    if (tempData[index].card) {
      tempData[index].card.push({
        id: uuidv4(),
        title: title,
        tags: [],
        task: [],
      });
      setData(tempData);
    } else {
      tempData[index].card = [
        {
          id: uuidv4(),
          title: title,
          tags: [],
          task: [],
        },
      ];
      setData(tempData);
    }
  };

  const removeCard = (boardId, cardId) => {
    const index = data.findIndex((item) => item.id === boardId);
    const tempData = [...data];
    const cardIndex = data[index].card.findIndex((item) => item.id === cardId);

    tempData[index].card.splice(cardIndex, 1);
    setData(tempData);
  };

  const addBoard = (title) => {
    const tempData = [...data];
    tempData.push({
      id: uuidv4(),
      boardName: title,
      card: [],
    });
    // console.log("addboard", tempData);
    setData(tempData);
  };

  const removeBoard = (bid) => {
    const tempData = [...data];
    const index = data.findIndex((item) => item.id === bid);
    tempData.splice(index, 1);
    setData(tempData);
  };

  const onDragEnd = (result) => {
    // console.log("result on drag end res ", result);
    const { source, destination } = result;
    // if (!destination) return;
    // console.log("on dragend", source, destination);
    if (source && destination) {
      if (source.droppableId === destination.droppableId) return;

      setData(dragCardInBoard(source, destination));
    }
  };

  const updateCard = (bid, cid, card) => {
    const index = data.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...data];
    const cards = tempBoards[index].card;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].card[cardIndex] = card;
    // console.log(tempBoards);
    setData(tempBoards);
  };

  const firebaseToken = useToken((state) => state.firebaseToken);
  const setFirebaseToken = useToken((state) => state.setFirebaseToken);

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLogin, setIsLogin] = useState(false);

  const [user, setUser] = useState(null);

  const dragCardInBoard = (source, destination) => {
    let tempData = [...data];
    console.log("drag in board temp", tempData);
    const destinationBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === destination.droppableId
    );
    const sourceBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === source.droppableId
    );
    tempData[destinationBoardIdx].card.splice(
      destination.index,
      0,
      tempData[sourceBoardIdx].card[source.index]
    );
    tempData[sourceBoardIdx].card.splice(source.index, 1);

    return tempData;
  };

  const handelAuth = async () => {
    setLoading(true);
    const route = isLogin ? "login" : "register";
    let res = await axios.post("http://localhost:3000/auth/" + route, formData);
    console.log(route, res?.data);
    // login
    if (isLogin && res.data) {
      setUser(res.data.user?.localId);
      setFirebaseToken(res.data.user?.localId);
    }
    // register
    if (!isLogin && res.data) {
      setUser(res.data.new_user?.localId);
      setFirebaseToken(res.data.new_user?.localId);
    }
  };

  useEffect(() => {}, [firebaseToken]);
  // const fbtoken = localStorage.getItem("fbtoken", firebaseToken);

  // console.log(fbtoken);

  useEffect(() => {
    const fetchData = async () => {
      if (firebaseToken) {
        console.log(firebaseToken);
        // fetch data existing user
        try {
          let res = await axios.get(
            "http://localhost:3000/data/get_todos/" + firebaseToken
          );
          let temp = res.data.todos;
          console.log("temp try part", temp);

          setData(temp);
          // fetch data new user
        } catch (err) {
          console.log(err);
          console.log(err.response.data.todos);
          setData(err.response.data.todos);
        }
        // if (res.status > 200) {
        // }
        // if (res.status < 500) {
        //   let temp = res.data.user.todos;
        //   console.log("temp <500 part", temp);
        //   setData(temp);
        // }
      }
    };
    fetchData();
  }, [firebaseToken]);

  useEffect(() => {
    const saveData = async () => {
      if (firebaseToken) {
        console.log("saving data...");
        let res = await axios.post(
          "http://localhost:3000/data/save_todos/" + firebaseToken,
          {
            todos_state: {
              todos: data,
            },
          }
        );
        console.log(res);
      }
    };

    setTimeout(() => {
      saveData();
    }, 10000);
  }, [data]);
  return (
    <div>
      {!firebaseToken ? (
        <>
          {!isLogin && (
            <>
              <div
                style={{
                  width: "100%",
                  height: "100vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="flex flex-col p-5 w-[20rem] h-[22rem] bg-gray-100 shadow-md border border-gray-300 items-center justify-start rounded">
                  <h1 className="text-2xl font-bold text-black text-center">
                    REGISTER
                  </h1>
                  <h1 className="text-sm font-bold text-black w-full">Email</h1>

                  <input
                    className="border p-2 w-full "
                    type="text"
                    placeholder="enter your email"
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                    }}
                  />

                  <h1 className="text-sm font-bold text-black w-full mt-2">
                    Password
                  </h1>

                  <input
                    className="border p-2 w-full "
                    type="text"
                    placeholder="enter your password"
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                    }}
                  />

                  <button
                    className="bg-green-500 w-full py-2 rounded mt-10 text-black font-semibold"
                    onClick={() => {
                      handelAuth();
                    }}
                  >
                    Register
                  </button>
                  <button
                    className="bg-blue-500 w-full py-2 rounded mt-2 text-black font-semibold"
                    onClick={() => {
                      setIsLogin(!isLogin);
                    }}
                  >
                    Switch to Login
                  </button>
                </div>
              </div>
            </>
          )}
          {isLogin && (
            <>
              <div
                style={{
                  width: "100%",
                  height: "100vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="flex flex-col p-5 w-[20rem] h-[22rem] bg-gray-100 shadow-md border border-gray-300 items-center justify-start rounded">
                  <h1 className="text-2xl font-bold text-black text-center">
                    LOGIN
                  </h1>
                  <h1 className="text-sm font-bold text-black w-full">Email</h1>

                  <input
                    className="border p-2 w-full "
                    type="text"
                    placeholder="enter your email"
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                    }}
                  />

                  <h1 className="text-sm font-bold text-black w-full mt-2">
                    Password
                  </h1>

                  <input
                    className="border p-2 w-full "
                    type="text"
                    placeholder="enter your password"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      });
                    }}
                  />

                  <button
                    className="bg-green-500 w-full py-2 rounded mt-10 text-black font-semibold"
                    onClick={() => {
                      handelAuth();
                    }}
                  >
                    LOGIN
                  </button>
                  <button
                    className="bg-blue-500 w-full py-2 rounded mt-2 text-black font-semibold"
                    onClick={() => {
                      setIsLogin(!isLogin);
                    }}
                  >
                    Switch to Register
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="App" data-theme={theme}>
            <Navbar
              switchTheme={switchTheme}
              // setDone={setDone}
              setData={setData}
            />
            <div className="app_outer">
              <div className="app_boards">
                {data.map((item) => (
                  <Board
                    key={item.id}
                    id={item.id}
                    name={item.boardName}
                    card={item.card}
                    setName={setName}
                    addCard={addCard}
                    removeCard={removeCard}
                    removeBoard={removeBoard}
                    updateCard={updateCard}
                  />
                ))}
                <Editable
                  class={"add__board"}
                  name={"Add Board"}
                  btnName={"Add Board"}
                  onSubmit={addBoard}
                  placeholder={"Enter Board  Title"}
                />
              </div>
            </div>
          </div>
        </DragDropContext>
      )}

      {/* {done && (
        
      )} */}
    </div>
  );
}

export default App;
