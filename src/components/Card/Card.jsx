import React, { useState, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Calendar, CheckSquare, Clock, MoreHorizontal } from "react-feather";
import Dropdown from "../Dropdown/Dropdown";
import Modal from "../Modal/Modal";
import Tag from "../Tags/Tag";
import "./Card.css";
import CardDetails from "./CardDetails/CardDetails";
import Subitem from "./Subitem";
const Card = (props) => {
  const [dropdown, setDropdown] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [values, setValues] = useState({ ...props.card });

  // functions

  const addTask = (value) => {
    values.task.push({
      id: uuidv4(),
      task: value,
      completed: false,
    });
    setValues({ ...values });
  };

  const removeTask = (id) => {
    const remaningTask = values.task.filter((item) => item.id !== id);
    setValues({ ...values, task: remaningTask });
  };

  const deleteAllTask = () => {
    setValues({
      ...values,
      task: [],
    });
  };

  const updateTask = (id) => {
    const taskIndex = values.task.findIndex((item) => item.id === id);
    values.task[taskIndex].completed = !values.task[taskIndex].completed;
    setValues({ ...values });
  };
  const updateTitle = (value) => {
    setValues({ ...values, title: value });
  };

  const calculatePercent = () => {
    const totalTask = values.task.length;
    const completedTask = values.task.filter(
      (item) => item.completed === true
    ).length;

    return Math.floor((completedTask * 100) / totalTask) || 0;
  };

  const removeTag = (id) => {
    const tempTag = values.tags.filter((item) => item.id !== id);
    setValues({
      ...values,
      tags: tempTag,
    });
  };

  const addTag = (value, color) => {
    values.tags.push({
      id: uuidv4(),
      tagName: value,
      color: color,
    });

    setValues({ ...values });
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
    <Draggable
      key={props.id.toString()}
      draggableId={props.id.toString()}
      index={props.index}
    >
      {(provided) => (
        <div className="">
          {modalShow && (
            <CardDetails
              updateCard={props.updateCard}
              onClose={setModalShow}
              card={props.card}
              bid={props.bid}
              removeCard={props.removeCard}
            />
          )}

          <div
            className="custom__card h-full"
            onClick={() => {}}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div className="card__text py-2 text-white">
              <p>{props.title}</p>
              <MoreHorizontal
                className="car__more"
                onClick={() => {
                  setDropdown(true);
                  setModalShow(true);
                }}
              />
            </div>

            <div className="card__tags">
              {props.tags?.map((item, index) => (
                <Tag key={index} tagName={item.tagName} color={item.color} />
              ))}
            </div>

            <div className="card__footer">
              <Subitem items={props.card.task} updateTask={updateTask} />
            </div>

            {provided.placeholder}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Card;
