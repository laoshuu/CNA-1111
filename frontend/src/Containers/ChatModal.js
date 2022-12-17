import { Modal, Select, Tooltip, Typography } from 'antd';
import { useChat } from '../Hooks/useChat';
import { useState } from 'react';
import { truncate, setsAreEqual } from '../utils';
import { useEffect } from 'react';
import ChatContent from './ChatContent';

const { Text } = Typography;

const ChatModal = ({
    openModal,
    setOpenModal,
    add,
    items,
    setItems,
    setActiveKey,
    removeItems,
    setRemoveItems,
    setInit,
    newTabIndex
}) => {

    const { Option } = Select;
    const { newChatRoom, name, friends, createChatToBE, messages, initChatRooms } = useChat();
    const [candidates, setCandidates] = useState([])


    useEffect(() => {
        if (Object.keys(newChatRoom).length !== 0) {
            const newChatRoomFriends = newChatRoom.people.filter(person => person !== name).length === 0 ? [name] : newChatRoom.people.filter(person => person !== name)

            const targetMessages = messages.length !== 0 ? messages.filter(msg => msg.chatroom_name === newChatRoom.chatroom_name) : []

            const friend_string = newChatRoomFriends.join(', ')
            const formatted_friend_string = truncate(friend_string)

            const tabFriend = {
                label: <Tooltip placement="top" title={friend_string}>{formatted_friend_string}</Tooltip>,
                children: <ChatContent targetMessages={targetMessages} />,
                closable: true,
                friends: newChatRoomFriends.includes(name) ? [] : newChatRoomFriends,
                people: new Set([...newChatRoom.people].sort()),
                chatroom_name: newChatRoom.chatroom_name,
                friend_string: friend_string,
                formatted_friend_string: formatted_friend_string,
                is_remove: false,
            }
            add(tabFriend)
            setOpenModal(false)
            setCandidates([])
        }
    }, [newChatRoom])



    useEffect(() => {
        if (initChatRooms.length !== 0) {
            const tabFriends = initChatRooms.map(ChatRoom => {
                const ChatRoomFriends = ChatRoom.people.filter(person => person !== name).length === 0 ? [name] : ChatRoom.people.filter(person => person !== name)

                const targetMessages = messages.length !== 0 ? messages.filter(msg => msg.chatroom_name === ChatRoom.chatroom_name) : []

                const friend_string = ChatRoomFriends.join(', ')
                const formatted_friend_string = truncate(friend_string)
                
                const newActiveKey = `newTab${newTabIndex.current++}`;

                const tabFriend = {
                    label: <Tooltip placement="top" title={friend_string}>{formatted_friend_string}</Tooltip>,
                    children: <ChatContent targetMessages={targetMessages} />,
                    closable: true,
                    friends: ChatRoomFriends.includes(name) ? [] : ChatRoomFriends,
                    people: new Set([...ChatRoom.people].sort()),
                    chatroom_name: ChatRoom.chatroom_name,
                    friend_string: friend_string,
                    formatted_friend_string: formatted_friend_string,
                    is_remove: false,
                    key: newActiveKey,
                }

                return tabFriend
            })

            setItems(tabFriends)
            setActiveKey(tabFriends[tabFriends.length - 1].key)
        }
        setInit(true)
    }, [initChatRooms])


    const onCancel = () => {
        setOpenModal(false)
        setCandidates([])
    }

    const onCreate = () => {
        if (removeItems.length) {
            const curCandidates = candidates.includes(name) ? new Set([...candidates].sort()) : new Set([...candidates, name].sort())
            const newTabs = [...items]
            const newRemoveTabs = [...removeItems]
            const keyTab = newRemoveTabs.filter(tab => setsAreEqual(tab.people, curCandidates))

            if (keyTab.length) {
                newTabs.push({ ...keyTab[0], is_remove: false })
                setItems(newTabs)
                setActiveKey(keyTab[0].key)
                setRemoveItems(newRemoveTabs.filter(tab => !setsAreEqual(tab.people, curCandidates)))
                setOpenModal(false)
                setCandidates([])
                return
            }
        }

        if (candidates.includes(name)) {
            createChatToBE([])
            return
        }
        createChatToBE(candidates)
    }

    return (
        <Modal
            open={openModal}
            title='Create A New Chat Room'
            okText='Create'
            cancelText='Cancel'
            onCancel={onCancel}
            onOk={onCreate}
            okButtonProps={{
                style: {
                    display: candidates.length === 0 && "none",
                },
            }}
        >
            <Text style={{ display: 'block', marginBottom: 3 }}>Friend List</Text>
            <Select
                mode="multiple"
                placeholder="Please select friends to chat ..."
                onChange={value => {
                    setCandidates(value)
                }}
                value={candidates}
                allowClear={true}
                style={{ width: '100%' }}
            >
                <Option value={name} key={name} disabled={!candidates.includes(name) && candidates.length !== 0 ? true : false}> {`${name} (Only Myself)`} </Option>
                {friends.map((friend) => <Option value={friend.name}
                    key={friend.name}
                    disabled={candidates.includes(name) ? true : false}
                > {friend.name} </Option>)}
            </Select>

        </Modal>
    );
};

export default ChatModal;