import { useState, useContext, createContext } from "react";
import { client } from "../utils";
import { message as antdmsg } from "antd";

const ChatContext = createContext({
    name: '',
    login: false,
    register: false,
    user: {},
    friends: [],
    newChatRoom: {},
    messages: [],
    initChatRooms: [],

    setName: () => { },
    registerToBE: () => { },
    loginToBE: () => { },
    createBet: () => { },
    makeBet: () => { },
    createChatToBE: () => { },
    initChatToBE: () => { },
    inputToBE: () => { },
})

const ChatProvider = (props) => {
    const [user, setUser] = useState({});
    const [name, setName] = useState('');
    const [friends, setFriends] = useState([]);
    const [newChatRoom, setNewChatRoom] = useState({});
    const [messages, setMessages] = useState([]);
    const [initChatRooms, setInitChatRooms] = useState([]);
    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(false);
    const [bet, setBet] = useState([
        { title: "去北車吃飯", challenger: "路人甲" }, { title: "搭笑傲飛鷹", challenger: "路人乙" },{ title: "去北車吃飯", challenger: "路人甲" },{ title: "去北車吃飯", challenger: "路人甲" },{ title: "去北車吃飯", challenger: "路人甲" },{ title: "去北車吃飯", challenger: "路人甲" }
    ])


    const displayStatus = (input_status) => {
        if (input_status.msg) {
            const { type, msg } = input_status;
            const content = {
                content: msg, duration: 1
            }
            switch (type) {
                case 'success':
                    antdmsg.success(content)
                    break
                case 'error':
                    antdmsg.error(content)
                    break
                case 'info':
                    antdmsg.info(content)
                    break
                default:
                    break
            }
        }
    }

    client.onmessage = (byteString) => {
        const { data } = byteString;
        const [task, payload] = JSON.parse(data);
        switch (task) {
            // case 'INIT': {
            //     const messages = payload
            //     setBet(messages)
            //     break
            // }
            case 'REGISTER': {
                const is_register = payload;
                setRegister(is_register);
                break;
            }
            case 'LOGIN': {
                const is_login = payload;
                setLogin(is_login);
                break;
            }
            case 'users': {
                const users = payload;
                const curUser = users.filter(each_user => each_user.name === name)
                const curFriends = users.filter(each_user => each_user.name !== name)
                setUser(curUser);
                setFriends(curFriends);
                break;
            }
            case 'createChat': {
                const newChatRoom = payload;
                setNewChatRoom(newChatRoom);
                break;
            }
            case 'initChat': {
                const { allMessages, allChatRooms } = payload;
                setMessages(allMessages);
                setInitChatRooms(allChatRooms);
                break;
            }
            case 'sendMessage': {
                const curMessage = payload;
                setMessages(prev => [...prev, { ...curMessage, is_read: true }]);
                break;
            }
            case 'receiveMessage': {
                const curMessage = payload;
                setMessages(prev => [...prev, { ...curMessage, is_read: false }]);
                break;
            }
            case 'status': {
                displayStatus(payload);
                break;
            }
            default: break;
        }
    }

    const sendData = (data) => {
        client.send(JSON.stringify(data));
    }

    const registerToBE = (input_name, input_pwd) => {
        sendData(['REGISTER', { name: input_name, password: input_pwd }]);
    }

    // login 之後傳資料到後端
    const loginToBE = (input_name, input_pwd) => {
        setName(input_name)
        sendData(['LOGIN', { name: input_name, password: input_pwd }]);
    }
    // Create Bet - Title, Username
    const createBet = (input_title, input_username) => {
        // setName(input_name)
        sendData(['CREATE_BET', { title: input_title, user_name: input_username }]);
    }
    // Make Bet - BetName, Username, ChoiceName, BetMoney
    const makeBet = (input_BetName, input_Username, input_ChoiceName, input_BetMoney) => {
        // setName(input_name)
        sendData(['MAKE_BET', { bet_title: input_BetName, username: input_Username, choice_name: input_ChoiceName, bet_money: input_BetMoney }]);
    }


    const createChatToBE = (friend_names) => {
        sendData(['createChat', { name: name, friend_names: friend_names }]);
    }

    const initChatToBE = () => {
        sendData(['initChat', { name: name }]);
    }

    const inputToBE = (input_msg, friend_names) => {
        sendData(['input', { name: name, message: input_msg, friend_names: friend_names }]);
    }

    return <ChatContext.Provider
        value={{
            name,
            login,
            register,
            user,
            friends,
            newChatRoom,
            messages,
            initChatRooms,
            bet,

            setName,
            registerToBE,
            loginToBE,
            createBet,
            makeBet,
            createChatToBE,
            initChatToBE,
            inputToBE,
        }}
        {...props}
    />
};

function useChat() {
    return useContext(ChatContext)
}

export { ChatProvider, useChat };