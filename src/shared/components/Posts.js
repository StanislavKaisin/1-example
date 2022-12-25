import React from "react";

export const Posts = ({
  data,
  onRemove = console.log,
  onEdit = console.log,
}) => {
  return (
    <ul>
      {data.map((d) => {
        return (
          <li key={d.id}>
            <h5>{d.title}</h5>
            {d.authorId}
            <br />
            <textarea
              style={{ width: "80%", height: "4em" }}
              value={d.text}
              onChange={(e) => {
                onEdit(d.id, e.target.value);
              }}
            />
            {/* {d.text} */}
            <br />
            <button onClick={() => onRemove(d.id)} type="button">
              remove
            </button>
          </li>
        );
      })}
    </ul>
  );
};
