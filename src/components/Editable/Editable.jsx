import React, { useState } from "react";
import { Plus, X } from "react-feather";
import "./Editable.css";
import Button from "./Button";
import Ripple from "./Ripple";

const Editable = (props) => {
  const [show, setShow] = useState(props?.handler || false);
  const [text, setText] = useState(props.defaultValue || "");

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      if (text && props.onSubmit) {
        setText("");
        props.onSubmit(text);
      }
      setShow(false);
    }, 300);
  };

  return (
    <div className={`editable  ${props.parentClass}`}>
      {show ? (
        <form onSubmit={handleOnSubmit}>
          <div className={`editable__input ${props.class}`}>
            <input
              className="text-black p-2 rounded-md focus:border-0 "
              placeholder={props.placeholder}
              id={"edit-input"}
              type={"text"}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex items-center gap-2 bg-[]">
              <Button type="submit">
                {`${props.btnName}` || "Add"}
                <Ripple color={"#1fecf9"} duration={500} />
              </Button>
              <X
                className="close"
                onClick={() => {
                  setShow(false);
                  props?.setHandler(false);
                }}
              />
            </div>
          </div>
        </form>
      ) : (
        <div
          onClick={() => {
            setTimeout(() => {
              setShow(true);
            }, 300);
          }}
        >
          <Button>
            <span className="flex items-center justify-start gap-1 mx-2">
              {props.defaultValue === undefined ? <Plus /> : <></>}
              {props?.name || "Add"}
            </span>
            <Ripple color={"#1fecf9"} duration={500} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Editable;
