import { useState, useContext, createContext, useEffect } from "react";
import { client } from "../utils";
import { message as antdmsg } from "antd";

const ChatContext = createContext({
    name: '',
    result: '',
    login: false,
    register: false,
    user: {},
    friends: [],
    newChatRoom: {},
    messages: [],
    initChatRooms: [],
    mail: [],

    setName: () => { },
    registerToBE: () => { },
    loginToBE: () => { },
    createBet: () => { },
    makeBet: () => { },
    createChatToBE: () => { },
    initChatToBE: () => { },
    inputToBE: () => { },
    setResult: () => { },
})

const ChatProvider = (props) => {
    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(false);

    const [user, setUser] = useState({});
    // const [name, setName] = useState('');
    const [name, setName] = useState('');
    const [money, setMoney] = useState(0);
    const [result, setResult] = useState(''); // 結果是成功還是失敗

    const [friends, setFriends] = useState([]);
    const [newChatRoom, setNewChatRoom] = useState({});
    const [messages, setMessages] = useState([]);
    const [initChatRooms, setInitChatRooms] = useState([]);

    const [allBets, setAllBets] = useState([
        // { title: "去北車吃飯", challenger: "路人甲" },
        // { title: "搭笑傲飛鷹", challenger: "路人乙" },
        // { title: "搭笑傲飛鷹", challenger: "路人乙" },
        // { title: "去北車吃飯", challenger: "路人甲" },
        // { title: "去北車吃飯", challenger: "路人甲" },
    ]);

    // betID, betTitle, challenger, betMoney, choice
    // variable name: id, title, challenger, money, choice
    const [madeBets, setMadeBets] = useState([])

    useEffect(() => {
        // console.log(madeBets)
    }, [madeBets])

    const [mail, setMail] = useState([
        { title: "去北車吃飯", challenger: "路人甲", money_change: 20 },
        { title: "搭笑傲飛鷹", challenger: "路人乙", money_change: 60 },
        { title: "搭笑傲飛鷹", challenger: "路人乙", money_change: -20 },
        { title: "去北車吃飯", challenger: "路人甲", money_change: -30 },
        { title: "去北車吃飯", challenger: "路人甲", money_change: 50 },
    ]);

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
            case 'INIT': {
                const [messages, made_messages] = payload
                // setMoney(money)
                setAllBets(messages)
                setMadeBets(made_messages) 
                break
            }
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
            case 'NEW_BET': {
                const new_bet = payload;
                console.log(payload)
                setAllBets([...allBets, new_bet])
                break
            }
            case 'MONEY': {
                const money = payload
                setMoney(money)
                break
            }
            case 'MAKE_BET': {
                const made_messages = payload
                setMadeBets([...madeBets, made_messages])
                break
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
                console.log(payload)
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
        sendData(['MAKE_BET', { bet_id: input_BetName, username: input_Username, choice_name: input_ChoiceName, bet_money: input_BetMoney }]);
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
            allBets,
            madeBets,
            money,
            result,
            mail,

            setName,
            registerToBE,
            loginToBE,
            createBet,
            makeBet,
            createChatToBE,
            initChatToBE,
            inputToBE,
            setResult,
        }}
        {...props}
    />
};

function useChat() {
    return useContext(ChatContext)
}

export { ChatProvider, useChat };