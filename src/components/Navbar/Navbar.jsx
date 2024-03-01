import React, { useEffect, useState, useRef } from "react";
import "./Navbar.css";
import test from "../../assets/test.mp3";
import { Pause, Play } from "react-feather";

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

  return (
    <div className="navbar">
      {isEdit ? (
        <input
          style={{ marginLeft: "45%" }}
          className="p-2 text-black w-auto"
          defaultValue={title}
          type="text"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      ) : (
        <h2
          style={{ marginLeft: "45%", fontSize: "30px", fontWeight: "bold" }}
          className="text-white"
          onDoubleClick={() => {
            setIsEdit(!isEdit);
          }}
        >
          {title}
        </h2>
      )}
      <audio ref={audioRef} src={test} />
      <button
        style={{ backgroundColor: "#afeeee" }}
        className="bg-white text-black p-3 rounded-full font-bold "
        onClick={togglePlay}
      >
        {isPlaying ? <Pause /> : <Play />}
      </button>
    </div>
  );
}
