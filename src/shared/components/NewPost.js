import React, { useState } from "react";

function getInitialState() {
  return {
    title: "",
    text: "",
    id: Math.ceil(Math.random() * 100000),
  };
}

export const NewPost = ({ onCreate = console.log }) => {
  const [state, setstate] = useState(() => getInitialState());
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("state", state);
        onCreate(state);
        setstate(getInitialState());
      }}
    >
      <div>
        <input
          placeholder="title"
          value={state.title}
          type="text"
          onChange={(e) => {
            setstate((prevState) => {
              return { ...prevState, title: e.target.value };
            });
          }}
        />
      </div>
      <div>
        <textarea
          placeholder="text"
          value={state.text}
          onChange={(e) => {
            setstate((prevState) => {
              return { ...prevState, text: e.target.value };
            });
          }}
        ></textarea>
      </div>
      <button type="submit">Submit new post</button>
    </form>
  );
};
