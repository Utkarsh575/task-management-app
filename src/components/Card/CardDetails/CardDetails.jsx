import React, { useState, useEffect } from "react";
import {
  Calendar,
  Check,
  CheckSquare,
  Clock,
  CreditCard,
  List,
  Plus,
  Tag,
  Trash,
  Type,
  X,
} from "react-feather";
import Editable from "../../Editable/Editable";
import Modal from "../../Modal/Modal";
import "./CardDetails.css";
import { v4 as uuidv4 } from "uuid";
import Label from "../../Label/Label";

export default function CardDetails(props) {
  const colors = ["#61bd4f", "#f2d600", "#ff9f1a", "#eb5a46", "#c377e0"];

  const [values, setValues] = useState({ ...props.card });
  const [input, setInput] = useState(false);
  const [text, setText] = useState(values.title);
  const [labelShow, setLabelShow] = useState(false);
  const Input = (props) => {
    return (
      <div className="h-full w-full mx-36">
        <input
          className="h-full w-full text-black p-2"
          autoFocus
          defaultValue={text}
          type={"text"}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
      </div>
    );
  };
  const addTask = (value) => {
    if (values.task) {
      values.task.push({
        id: uuidv4(),
        task: value,
        completed: false,
      });
      setValues({ ...values });
    }
  };

  const removeTask = (id) => {
    if (values.task) {
      const remaningTask = values.task.filter((item) => item.id !== id);
      setValues({ ...values, task: remaningTask });
    }
  };

  const deleteAllTask = () => {
    setValues({
      ...values,
      task: [],
    });
  };

  const updateTask = (id) => {
    if (values.task) {
      const taskIndex = values.task.findIndex((item) => item.id === id);
      values.task[taskIndex].completed = !values.task[taskIndex].completed;
      setValues({ ...values });
    }
    const updateTitle = (value) => {
      setValues({ ...values, title: value });
    };
  };

  const calculatePercent = () => {
    if (values.task) {
      const totalTask = values.task.length;
      const completedTask = values.task.filter(
        (item) => item.completed === true
      ).length;

      return Math.floor((completedTask * 100) / totalTask) || 0;
    }
  };

  const removeTag = (id) => {
    const tempTag = values.tags.filter((item) => item.id !== id);
    setValues({
      ...values,
      tags: tempTag,
    });
  };

  const addTag = (value, color) => {
    if (values.tags) {
      values.tags.push({
        id: uuidv4(),
        tagName: value,
        color: color,
      });

      setValues({ ...values });
    }
  };

  const handelClickListner = (e) => {
    if (e.code === "Enter") {
      setInput(false);
      updateTitle(text === "" ? values.title : text);
    } else return;
  };

  useEffect(() => {
    document.addEventListener("keypress", handelClickListner);
    return () => {
      document.removeEventListener("keypress", handelClickListner);
    };
  });
  useEffect(() => {
    if (props.updateCard) props.updateCard(props.bid, values.id, values);
  }, [values]);

  return (
    <Modal onClose={props.onClose}>
      <div
        className="local__bootstrap p-10 rounded-md"
        style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "white" }}
      >
        <div
          className="container  p-10  rounded-md "
          style={{
            minWidth: "650px",
            position: "relative",
            backgroundColor: "rgba(0,0,0,0.0)",
          }}
        >
          <div className="row pb-4">
            <div className="col-12">
              <div className="d-flex justify-content-center pt-3 gap-2 text-center ">
                {/* <CreditCard className="icon__md" /> */}
                {input ? (
                  <Input title={values.title} />
                ) : (
                  <h5
                    style={{ cursor: "pointer" }}
                    onClick={() => setInput(true)}
                  >
                    {values.title}
                  </h5>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-8">
              <h6 className="text-justify">Label</h6>
              <div
                className="d-flex label__color flex-wrap"
                style={{ width: "500px", paddingRight: "10px" }}
              >
                {values.tags && values.tags.length !== 0 ? (
                  values.tags.map((item) => (
                    <span
                      className="d-flex justify-content-between align-items-center gap-2"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.tagName.length > 10
                        ? item.tagName.slice(0, 6) + "..."
                        : item.tagName}
                      <X
                        onClick={() => removeTag(item.id)}
                        style={{ width: "15px", height: "15px" }}
                      />
                    </span>
                  ))
                ) : (
                  <span
                    style={{ color: "#ccc" }}
                    className="d-flex justify-content-between align-items-center gap-2"
                  >
                    <i> No Labels</i>
                  </span>
                )}
              </div>
              <div className="check__list mt-2">
                <div className="d-flex align-items-end  justify-content-between">
                  <div className="flex items-center justify-center gap-2">
                    <h6>☑️ Check List</h6>
                  </div>
                  <div className="">
                    <button
                      className=" px-2 py-2 border rounded hover:bg-[rgba(255,0,0,0.57)]"
                      onClick={() => deleteAllTask()}
                    >
                      Delete all tasks
                    </button>
                  </div>
                </div>
                <div className="progress__bar mt-2 mb-2">
                  <div className="progress flex-1">
                    <div
                      class="progress-bar"
                      role="progressbar"
                      style={{ width: calculatePercent() + "%" }}
                      aria-valuenow="75"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {calculatePercent() + "%"}
                    </div>
                  </div>
                </div>

                <div className="my-2">
                  {values.task && values.task.length !== 0 ? (
                    values.task.map((item, index) => (
                      <div className="task__list d-flex align-items-start gap-2">
                        <input
                          className="task__checkbox"
                          type="checkbox"
                          defaultChecked={item.completed}
                          onChange={() => {
                            updateTask(item.id);
                          }}
                        />

                        <h6
                          className={`flex-grow-1 ${
                            item.completed === true ? "strike-through" : ""
                          }`}
                        >
                          {item.task}
                        </h6>
                        <Trash
                          onClick={() => {
                            removeTask(item.id);
                          }}
                          style={{
                            cursor: "pointer",
                            widht: "18px",
                            height: "18px",
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <></>
                  )}

                  <Editable
                    parentClass={"task__editable"}
                    name={"Add Task"}
                    btnName={"Add task"}
                    onSubmit={addTask}
                  />
                </div>
              </div>
            </div>
            <div className="col-4">
              <h6>Add to card</h6>
              <div className="flex flex-col items-center justify-between gap-2 ">
                <button
                  className="border rounded flex items-center justify-center w-full py-2 hover:bg-[rgba(255,150,0,0.57)]"
                  onClick={() => setLabelShow(true)}
                >
                  <span className="">🏷️</span>
                  Add Label
                </button>
                {labelShow && (
                  <Label
                    color={colors}
                    addTag={addTag}
                    tags={values.tags}
                    onClose={setLabelShow}
                  />
                )}

                <button
                  className="border rounded flex items-center justify-center w-full py-2 hover:bg-[rgba(255,0,0,0.57)]"
                  onClick={() => props.removeCard(props.bid, values.id)}
                >
                  <span className="">🗑️</span>
                  Delete Card
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
