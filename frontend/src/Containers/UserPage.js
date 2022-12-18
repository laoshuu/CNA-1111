import React, { useState, useRef, useEffect } from "react";
import { Divider, Typography } from 'antd';
import { HomeOutlined, PlusOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Col, Row, Statistic, Tabs } from 'antd';
import { useChat } from "../Hooks/useChat";
import styled from "styled-components";
import Form from "../components/Form";
import FilterButton from "../components/FilterButton";
import Todo from "../components/Todo";
import CreateBetModal from "../components/CreateBetModal";
import { useNavigate } from "react-router-dom";

import { nanoid } from "nanoid";
const { Title, Paragraph, Text, Link } = Typography;

const StatisticStyle = styled(Statistic)`
    width: 80%;
    margin: 10px;
    margin-top: 15%
`;

const StyledBotton = styled(Button)`
    width: 40%;
    height: 70%;
    margin: 10px
`;

const BetBoxWrapper = styled.div`
    height: calc(240px - 36px);
    display: flex;
    flex-direction: column;
    overflow: auto;
`

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
    const { name, money, bet } = useChat();
    const [tasks, setTasks] = useState(["12233", "PK", "LAUSHU"]);
    const [filter, setFilter] = useState('All');

    const navigate = useNavigate()
    const [tmp, setTmp] = useState(false)

    useEffect(() => {
        if (tmp) {
            navigate("/main")
        }
    }, [tmp]);

    function toggleTaskCompleted(id) {
        const updatedTasks = tasks.map(task => {
            // if this task has the same ID as the edited task
            if (id === task.id) {
                // use object spread to make a new obkect
                // whose `completed` prop has been inverted
                return { ...task, completed: !task.completed }
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

    // Create Bet Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showCreateBet = () => {
        setIsModalOpen(true);
    };
    const Modal_on_create = (friendName) => {
        // Already exist 
        // send message to backend
    }

    const Modal_on_cancel = () => {
        setIsModalOpen(false)
    }
    const createList = (betList) => {
        return(
            betList.length === 0 ? (
                <p style={{ color: '#ccc' }}> No bet... </p>
            ) : (
                <BetBoxWrapper>
                    {
                        betList.map(({ title, challenger }, i) => {
                            return (<BetCard betTitle={title} challenger={challenger} key={i} />)
                        })
                    }
                    {/* <FootRef ref={msgFooter} /> */}
                </BetBoxWrapper>
            )
        )
    }

    return (
        <>
            <Title> {name}'s Personal Page </Title>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <StyledBotton icon={<HomeOutlined />} onClick={() => setTmp(true)} > Back to home page </StyledBotton>
                <StyledBotton icon={<PlusOutlined />} onClick={() => showCreateBet()} > Create a new bet </StyledBotton>
                <StyledBotton icon={<MailOutlined />} onClick={() => { }} > Open your mail box </StyledBotton>
            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>
                <Title level={4}> 剩餘金額 </Title>
                <StatisticStyle title="NTU Dollar" value={money} precision={2} />
            </div>

            <Title level={2}>
                <p>All Your Bets</p>
            </Title>
            <Tabs
                defaultActiveKey="1"
                centered
                items={[
                    {
                        label: 'Tab 1',
                        key: "1",
                        children: bet[0]
                    },
                    {
                        label: 'Tab 2',
                        key: "2",
                        children: 
                    }]}
            />
            <div>
                {filterList}
                {taskList}
            </div>
            {/* <Title level={2}> 開局 </Title>
            <Form addTask={addTask} /> */}
            <CreateBetModal
                open={isModalOpen}
                onCreate={({ name }) => { Modal_on_create(name) }}
                onCancel={Modal_on_cancel}
            />
        </>
    );
}

export default UserPage;