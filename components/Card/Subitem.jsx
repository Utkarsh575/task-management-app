import React from "react";

const Subitem = ({ updateTask, items }) => {
  const [show, setShow] = React.useState(true);

  return (
    <div className="flex flex-col w-full">
      <button
        className="absolute right-5  -translate-y-5"
        onClick={() => {
          setShow(!show);
        }}
      >
        {show ? <>&#xfe3f;</> : <>&#xfe40;</>}
      </button>
      {show && items.length !== 0 && (
        <div className="task w-full  mt-2 border border-x-[rgba(0,0,0,0.3)] border-t-[rgba(0,0,0,0.3)] border-b-2 border-b-[#252525] rounded-md p-2">
          {/* <CheckSquare /> */}
          <div className="flex flex-col  w-full gap-2 ">
            {items.map((e, idx) => {
              console.log("e", e);
              return (
                <div className="flex items-center justify-between w-full  py-3  rounded-md px-2">
                  <h6
                    className={`text-light ${
                      e.completed ? "line-through" : "font-bold"
                    }`}
                  >
                    {e.task}
                  </h6>
                  <input
                    className="h-5 w-5"
                    type="checkbox"
                    onChange={(action) => {
                      updateTask(e.id);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Subitem;
