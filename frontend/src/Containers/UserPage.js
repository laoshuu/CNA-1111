import React, { useState, useRef, useEffect } from "react";
import Form from "../components/Form";
import FilterButton from "../components/FilterButton";
import Todo from "../components/Todo";
import { nanoid } from "nanoid";

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

const FILTER_MAP = {
    My_Bet: task => !task.BetSet,
    Pay_Bet: task => task.BetSet
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
    const [tasks, setTasks] = useState([
        { id: "todo-0", name: "睡覺", BetSet: false },
        { id: "todo-1", name: "跑", BetSet: true },
        { id: "todo-2", name: "跳", BetSet: true }
    ]);
    const [filter, setFilter] = useState('My_Bet');

    function toggleTaskCompleted(id) {
        const updatedTasks = tasks.map(task => {
            if (id === task.id) {
                return { ...task, completed: !task.completed }
            }
            return task;
        });
        setTasks(updatedTasks);
    }

    function FailTask(id) {
        const remainingTasks = tasks.filter(task => id !== task.id);
        setTasks(remainingTasks);
    }

    function SuccessTask(id) {
        const remainingTasks = tasks.filter(task => id !== task.id);
        setTasks(remainingTasks);
    }

    function editTask(id, newName) {
        const editedTaskList = tasks.map(task => {
            if (id === task.id) {
                return { ...task, name: newName }
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
                FailTask={FailTask}
                SuccessTask={SuccessTask}
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

    const tasksNoun = taskList.length !== 1 ? '剩下' : '剩下';
    const headingText = `${tasksNoun}${taskList.length}個挑戰`;

    const listHeadingRef = useRef(null);
    const prevTaskLength = usePrevious(tasks.length);

    useEffect(() => {
        if (tasks.length - prevTaskLength === -1) {
            listHeadingRef.current.focus();
        }
    }, [tasks.length, prevTaskLength]);

    return (
        <div className="todoapp stack-large">
            <h2>姓名：</h2>
            <h2>剩餘金額：</h2>
            <Form addTask={addTask} />
            <div className="App">
            </div>
            <div className="filters btn-group stack-exception">
                {filterList}
            </div>
            <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
                {headingText}
            </h2>
            <ul
                role="list"
                className="todo-list stack-large stack-exception"
                aria-labelledby="list-heading"
            >
                {taskList}
            </ul>
        </div>
    );
}

export default App;