import React, { useEffect, useState, useRef } from "react";
import "./Navbar.css";
import test from "../../assets/test.mp3";
import { Pause, Play } from "react-feather";
import { useToken } from "../../store/store";

export default function Navbar(props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState(
    localStorage.getItem("app-title") | "Hierarchical Todo List App"
  );

  useEffect(() => {
    let title = localStorage.getItem("app-title");
    if (title) {
      setTitle(title);
    } else {
      setTitle("Hierarchical Todo List App");
    }
  }, []);

  const handelClickListner = (e) => {
    if (e.code === "Enter") {
      setIsEdit(false);
      localStorage.setItem("app-title", e.target.value);
    } else return;
  };

  useEffect(() => {
    document.addEventListener("keypress", handelClickListner);
    return () => {
      document.removeEventListener("keypress", handelClickListner);
    };
  });
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef?.current?.pause();
    } else {
      audioRef?.current?.play();
    }
    setIsPlaying(!isPlaying);
  };
  const setFirebaseToken = useToken((state) => state.setFirebaseToken);

  return (
    <div
      className="navbar"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isEdit ? (
        <input
          // style={{ marginLeft: "45%" }}
          className="p-2 text-black w-auto"
          defaultValue={title}
          type="text"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      ) : (
        <h2
          style={{ fontSize: "30px", fontWeight: "bold" }}
          className="text-black text-xl py-2"
          onDoubleClick={() => {
            setIsEdit(!isEdit);
          }}
        >
          {title}
        </h2>
      )}
      <audio ref={audioRef} src={test} />
      <div
        style={{
          right: "0",
          top: "0",
          marginRight: "20px",
          position: "absolute",
          display: "flex",
        }}
      >
        <button
          style={{ backgroundColor: "#afeeee" }}
          className="bg-white text-black p-3 rounded-full font-bold "
          onClick={togglePlay}
        >
          {isPlaying ? <Pause /> : <Play />}
        </button>

        <button
          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white border border-gray-900 rounded ml-10"
          onClick={() => {
            // props.setDone(false);
            props.setData(() => {
              [];
            });
            // localStorage.removeItem("fbtoken");
            // localStorage.removeItem("kanban-board");
            setFirebaseToken(null);
            window.location.reload();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
