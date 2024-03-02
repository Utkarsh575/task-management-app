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
function App() {
  const [data, setData] = useState(
    localStorage.getItem("kanban-board")
      ? JSON.parse(localStorage.getItem("kanban-board"))
      : []
  );
  console.log(data);
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

  const dragCardInBoard = (source, destination) => {
    let tempData = [...data];
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
    tempData[index].card.push({
      id: uuidv4(),
      title: title,
      tags: [],
      task: [],
    });
    setData(tempData);
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
    setData(tempData);
  };

  const removeBoard = (bid) => {
    const tempData = [...data];
    const index = data.findIndex((item) => item.id === bid);
    tempData.splice(index, 1);
    setData(tempData);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) return;

    setData(dragCardInBoard(source, destination));
  };

  const updateCard = (bid, cid, card) => {
    const index = data.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...data];
    const cards = tempBoards[index].card;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].card[cardIndex] = card;
    console.log(tempBoards);
    setData(tempBoards);
  };
  let idToken = localStorage.getItem("idToken");
  const [loginToken, setLoginToken] = useState("");

  const [formData, setFormData] = useState({});
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    localStorage.setItem("kanban-board", JSON.stringify(data));
  }, [data]);

  const fetchData = async () => {
    if (loginToken.length > 2) {
      let res = axios.get("http://localhost:3000/data/get_todos/" + loginToken);
      console.log(res);
      if (res.data) {
        setData(res.data.todos);
      }
    }
  };
  const handelAuth = async () => {
    console.log(formData);
    const route = isLogin ? "login" : "register";
    let res = await axios.post("http://localhost:3000/auth/" + route, formData);
    console.log(route, res?.data);
    if (!isLogin) {
      if (res?.data?.new_user) {
        localStorage.setItem("idToken", res?.data?.new_user?.localId);
        setLoginToken(res?.data?.new_user?.localId);
        fetchData();
      }
    }

    if (isLogin) {
      if (res?.data?.user) {
        localStorage.setItem("idToken", res?.data?.user?.localId);
        setLoginToken(res?.data?.user?.localId);
        fetchData();
      }
    }
  };
  useEffect(() => {
    let t = localStorage.getItem("idToken");

    if (t) {
      setLoginToken(t);
      fetchData();
    }
  }, []);
  useEffect(() => {}, [loginToken]);

  useEffect(() => {
    let t = localStorage.getItem("idToken");

    (async () => {
      let res = axios.post("http://localhost:3000/data/save_todos/" + t, {
        todos_state: {
          todos: data,
        },
      });
      console.log(res);
    })();
  }, [data]);

  return (
    <div>
      {loginToken.length > 2 ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="App" data-theme={theme}>
            <Navbar switchTheme={switchTheme} setLoginToken={setLoginToken} />
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
      ) : (
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
                    <h1 className="text-sm font-bold text-black w-full">
                      Email
                    </h1>

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
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
