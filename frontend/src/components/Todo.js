import React, { useEffect, useRef, useState } from "react";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function Todo(props) {
  const [newName, setNewName] = useState('');

  const editButtonRef = useRef(null);

  function handleChange(e) {
    setNewName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!newName.trim()) {
      return;
    }
    props.editTask(props.id, newName);
    setNewName("");
  }

  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          id={props.id}
          className="todo-text"
          type="text"
          value={newName || props.name}
          onChange={handleChange}
        />
      </div>
    </form>
  );

  const viewTemplate = (
    <div className="stack-small">

      <div className="c-cb">
          <label className="todo-label" htmlFor={props.id}>
            {props.name}
          </label>
        </div>

        <div className="btn-group">

        <button
          type="button"
          className="btn"
          onClick={() => props.SuccessTask(props.id)}
          ref={editButtonRef}
          >
            挑戰成功 <span className="visually-hidden">{props.name}</span>
          </button>

          <button
            type="button"
            className="btn btn__danger"
            onClick={() => props.FailTask(props.id)}
          >
            挑戰失敗 <span className="visually-hidden">{props.name}</span>
          </button>
        </div>
    </div>
  );

  useEffect(() => {
      editButtonRef.current.focus()});

  return <li className="todo">{viewTemplate}</li>;
}
