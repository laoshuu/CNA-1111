import React, { useState } from "react";
import '../Containers/UserPage'

export default function Form(props) {
  const [name, setName] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }
    props.addTask(name);
    setName("");
  }

  function handleChange(e) {
    setName(e.target.value);
  }

  return (
    <div className="popup">
      <form onSubmit={handleSubmit}>
        <h2 className="label-wrapper">
          <label htmlFor="new-todo-input" className="label__lg">
            輸入賭注內容：
          </label>
        </h2>

        <input
          type="text"
          id="new-todo-input"
          className="input input__lg"
          name="text"
          autoComplete="off"
          value={name}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn__primary btn__lg">
          新增
        </button>
      </form>
    </div>
  );
}