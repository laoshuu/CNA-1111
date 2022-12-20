import { useState, useContext, createContext, useEffect } from "react";
import { client } from "../utils";
import { message as antdmsg } from "antd";

const ChatContext = createContext({
    name: '',
    result: '',
    login: false,
    register: false,
    mail: [],
    allBets: [],
    madeBets: [],



    setName: () => { },
    registerToBE: () => { },
    loginToBE: () => { },
    createBet: () => { },
    makeBet: () => { },
    endBet: () => { },
    setResult: () => { },
})

const ChatProvider = (props) => {
    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(false);
    const [name, setName] = useState('');
    const [money, setMoney] = useState(0);
    const [result, setResult] = useState(''); // 結果是成功還是失敗
    const [allBets, setAllBets] = useState([]);

    // betID, betTitle, challenger, betMoney, choice
    // variable name: id, title, challenger, money, choice
    const [madeBets, setMadeBets] = useState([])
    const [mail, setMail] = useState([]);

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

            case 'ALLBETS': {
                const messages = payload
                setAllBets(messages)
                break
            }
            case 'MADEBETS': {
                const messages = payload
                setMadeBets(messages)
                break
            }
            case 'MAIL': {
                const mails = payload
                setMail(mails)
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
        sendData(['MAKE_BET', { bet_id: input_BetName, username: input_Username, choice_name: input_ChoiceName, bet_money: input_BetMoney }]);
    }
    // End Bet - BetName, Username, ChoiceName, BetMoney
    const endBet = (input_name, input_betID, input_ChoiceName) => {
        // setName(input_name)
        sendData(['END_BET', { name: input_name, bet_id: input_betID, result: input_ChoiceName }]);
    }

    return <ChatContext.Provider
        value={{
            name,
            login,
            register,
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
            endBet,
            setResult,
        }}
        {...props}
    />
};

function useChat() {
    return useContext(ChatContext)
}

export { ChatProvider, useChat };