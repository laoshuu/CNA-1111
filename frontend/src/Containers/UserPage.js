import React, { useState, useRef, useEffect } from "react";
import { Divider, Typography } from 'antd';
import { Button, Col, Row, Statistic } from 'antd';
import { useChat } from "../Hooks/useChat";
import styled from "styled-components";
import Form from "../components/Form";
import FilterButton from "../components/FilterButton";
import Todo from "../components/Todo";
import { nanoid } from "nanoid";
const { Title, Paragraph, Text, Link } = Typography;

const StatisticStyle = styled(Statistic)`
    width: 80%;
    margin: 10px;
    margin-top: 15%
`;

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FILTER_MAP = {
  All: () => true,
  Active: task => !task.completed,
  Completed: task => task.completed
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

const UserPage = () => {
  const [tasks, setTasks] = useState(["12233","PK","LAUSHU"]);
  const [filter, setFilter] = useState('All');

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map(task => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new obkect
        // whose `completed` prop has been inverted
        return {...task, completed: !task.completed}
      }
      return task;
    });
    setTasks(updatedTasks);
  }


  function deleteTask(id) {
    const remainingTasks = tasks.filter(task => id !== task.id);
    setTasks(remainingTasks);
  }


  function editTask(id, newName) {
    const editedTaskList = tasks.map(task => {
    // if this task has the same ID as the edited task
      if (id === task.id) {
        //
        return {...task, name: newName}
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  const taskList = tasks
  .filter(FILTER_MAP[filter])
  .map(task => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));

  const filterList = FILTER_NAMES.map(name => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  function addTask(name) {
    const newTask = { id: "todo-" + nanoid(), name: name, completed: false };
    setTasks([...tasks, newTask]);
  }


  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task';
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  const { name, money } = useChat();

  return (
    <>
        <Title> {name}'s Personal Page </Title>
        <div style={{ display: "flex", flexDirection: "row" }}>
            <Title level={4}> 剩餘金額 </Title>
            <StatisticStyle title="NTU Dollar" value={money} precision={2}/>
        </div>
                    
        <Title level={2}> 
        <p>下注中</p> 
        </Title>
        <div>
        {filterList}
        {taskList}
        </div>
        <Title level={2}> 開局 </Title>
        <Form addTask={addTask} />
    </>
  );
}

export default UserPage;