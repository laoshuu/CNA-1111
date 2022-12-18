import React, { useState, useRef, useEffect } from "react";
import { Divider, Typography } from 'antd';
import { HomeOutlined, PlusOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Col, Row, Statistic, Tabs, Drawer, List } from 'antd';
import { useChat } from "../Hooks/useChat";
import styled from "styled-components";

import Form from "../Components/Form";
import FilterButton from "../Components/FilterButton";
import Todo from "../Components/Todo";

import CreateBetModal from "../Components/CreateBetModal";
import BetCard from "../Components/BetCard";
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
    const { name, money, bet, mail } = useChat();
    const [tasks, setTasks] = useState(["12233", "PK", "LAUSHU"]);
    const [filter, setFilter] = useState('All');
    const [createBetBox, setCreateBetBox] = useState([]);
    const [makeBetBox, setMakeBetBox] = useState([]);
    const [activeKey, setActiveKey] = useState("Create"); // 目前被點選的 Bet List

    const navigate = useNavigate()
    const [BackToMain, setBackToMain] = useState(false)
    const [GoToMail, setGoToMail] = useState(false)

    useEffect(() => {
        if (BackToMain) {
            navigate("/main")
        }
    }, [BackToMain]);

    useEffect(() => {
        if (GoToMail) {
            navigate("/mail")
        }
    }, [GoToMail]);

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

    // 產生 Bet List 的 DOM nodes
    const displayList = (betList, CreateOrMake) => {
        return (
            betList.length === 0 ? (
                <p style={{ color: '#ccc' }}> No bet... </p>
            ) : (
                <BetBoxWrapper>
                    {
                        betList.map(({ title, challenger }, i) => {
                            if (CreateOrMake === 'Create' && challenger === name) {
                                // console.log("filter create:", CreateOrMake)
                                return (<BetCard betTitle={title} challenger={challenger} key={i} />)
                            }
                            else if (CreateOrMake === 'Make' && challenger !== name) {
                                // console.log("filter make")
                                return (<BetCard betTitle={title} challenger={challenger} key={i} />)
                            }
                            else {
                                return
                            }
                        })
                    }
                </BetBoxWrapper>
            )
        )
    }

    // Generate the content of Tabs (CreateBet, MakeBet)
    useEffect(() => {
        setCreateBetBox({
            label: "The Bet You Create",
            children: displayList(bet, "Create"),
            key: "Create"
        });
        setMakeBetBox({
            label: "The Bet You Make",
            children: displayList(bet, "Make"),
            key: "Make"
        });
    }, [bet]);

    // Create Mail Drawer
    const [isMailOpen, setIsMailOpen] = useState(false);
    const ShowDrawer = () => {
        setIsMailOpen(true);
    };
    const CloseDrawer = () => {
        setIsMailOpen(false);
    };
    const CreateMailMessage = () => {

    }

    return (
        <>
            <Title> {name}'s Personal Page </Title>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <StyledBotton icon={<HomeOutlined />} onClick={() => setBackToMain(true)} > Back to home page </StyledBotton>
                <StyledBotton icon={<PlusOutlined />} onClick={() => showCreateBet()} > Create a new bet </StyledBotton>
                <StyledBotton icon={<MailOutlined />} onClick={() => {
                    CreateMailMessage();
                    ShowDrawer()
                }} > Open your mail box
                </StyledBotton>
            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>
                <Title level={4}> 剩餘金額 </Title>
                <StatisticStyle title="NTU Dollar" value={money} precision={2} />
            </div>

            <Title level={2}>
                <p>All Your Bets</p>
            </Title>
            <Tabs
                defaultActiveKey="Create"
                centered
                onChange={(key) => {
                    setActiveKey(key)
                }}
                activeKey={activeKey}
                items={[createBetBox, makeBetBox]}
            />
            {/* <div>
                {filterList}
                {taskList}
            </div> */}
            {/* <Title level={2}> 開局 </Title>
            <Form addTask={addTask} /> */}
            <CreateBetModal
                open={isModalOpen}
                onCreate={({ name }) => { Modal_on_create(name) }}
                onCancel={Modal_on_cancel}
            />
            <Drawer title={`${name}'s Mail Box`} placement="right" onClose={CloseDrawer} open={isMailOpen}>
                <List
                    header={<div>Money Change</div>}
                    // footer={<div>Footer</div>}
                    bordered
                    dataSource={mail}
                    renderItem={(item) => (
                        <List.Item>
                            <Typography.Text mark>[ITEM]</Typography.Text> {item}
                        </List.Item>
                    )}
                />
            </Drawer>

        </>
    );
}

export default UserPage;