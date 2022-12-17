import bcrypt from "bcrypt"
import { UserModel, BetModel, ChoiceModel, UserChoiceModel } from "./models/chatbox"

const sendData = (data, ws) => { ws.send(JSON.stringify(data)); }
const sendStatus = (payload, ws) => { sendData(["status", payload], ws); }
// Send message to every client
const broadcastMessage = (wss, data, status) => {
    wss.clients.forEach((client) => {
        sendData(data, client);
        sendStatus(status, client);
    });
};


export default {
    onMessage: (wss, ws) => (
        async (byteString) => {
            const { data } = byteString
            const [type, payload] = JSON.parse(data)
            switch (type) {
                case 'CREATE_BET': {
                    const { title, user_name } = payload;
                    const user = await UserModel.findOne({ name: user_name })
                    const Bet = new BetModel({ title: title, challenger: user.id })
                    await Bet.save()
                    broadcastMessage(
                        wss,
                        ['NEW_BET', [{ id: Bet._id, title: title, challenger: user._id }]],
                        {
                            type: 'success',
                            msg: `New bet created by ${user.name}!`
                        })
                    break
                }
                case 'MAKE_BET': {
                    const { bet_id, username, choice_name, bet_money } = payload;
                    const user = await UserModel.findOne({ name: username })
                    // const choice = await ChoiceModel.findOne({ bet_id: bet_id, name: choice_name })
                    // check enough money
                    if (user.money < bet_money)
                        sendData(["status", { type: "error", msg: "Not enough money!" }], ws)
                    else {
                        await UserModel.updateOne({ "name": user.name }, { $inc: { "money": -bet_money } })
                        const newBet = new UserChoiceModel({ user: user._id, bet_id: bet_id, choice: choice_name, bet_money: bet_money })
                        newBet.save()
                    }
                    break
                }
                case 'REGISTER': {
                    const { name, password } = payload;
                    // check user already exist
                    const user = await UserModel.findOne({ name: name })
                    if (user)
                        sendData(["status", { type: "error", msg: "Username already taken" }], ws)
                    else {
                        const salt = await bcrypt.genSalt(10);
                        const hashPassword = await bcrypt.hash(password, salt)
                        const newUser = new UserModel({ name: name, password: hashPassword, money: 100 })
                        newUser.save()
                        sendData(["REGISTER", true], ws)
                    }
                    break
                }
                case 'LOGIN': {
                    const { name, password } = payload;
                    const user = await UserModel.findOne({ name: name })
                    if (!user)
                        sendData(["status", { type: "error", msg: "Username does not exist" }], ws)
                    else {
                        const password_is_valid = await bcrypt.compare(password, user.password)
                        if (!password_is_valid)
                            sendData(["status", { type: "error", msg: "Wrong password" }], ws)

                        else {
                            sendData(["LOGIN", true], ws)
                            sendData(["status", { type: "success", msg: "Successfully Login!" }], ws)

                            const messages = []
                            await BetModel.find().populate("challenger").then((res) => {
                                console.log(res)
                                res.map((bet) => messages.push({ id: bet._id, title: bet.title, challenger: bet.challenger.name }))
                            });

                            sendData(["INIT", messages], ws)
                        }
                    }
                    break
                }
                case 'END_BET': {
                    const { bet_id, result } = payload;

                    const choices = await ChoiceModel.find({ bet_id: bet_id })
                    const correct_choice = await UserChoiceModel.find({ bet_id: bet_id, choice: result })

                    let correct_num, wrong_num, correct_money, wrong_money, challenger_award;
                    correct_num = correct_choice.count()
                    wrong_num = choices.count() - correct_num
                    // calculate correct_money, wrong_money


                    if (correct_choice.choice === 'Success') {
                        if (correct_num === 0)
                            challenger_award = correct_money + wrong_money;
                        else
                            challenger_award = fail_money / (success_num + 1)
                    }
                    else if (correct_choice.choice === 'Fail') {
                        challenger_award = 0
                    }

                    // challenger get rewards
                    const Bet = await BetModel.findOne({ bet_id: bet_id })
                    const challenger = Bet.challenger
                    await UserModel.updateOne({ "name": challenger }, { $inc: { "money": challenger_award } })
                    // Bet makers get rewards
                    // const win_bet = await UserChoiceModel.find({ choice: correct_choice._id })
                    correct_choice.map(async (e) => {
                        await UserModel.updateOne({ "_id": e.user }, { $inc: { "money": (fail_money + success_money - challenger_award) * e.bet_money / success_money } })
                    })
                    break
                }


                case 'CHAT': {
                    console.log("now in chat")
                    const { name, to } = payload
                    const chatBoxName = makeName(name, to)
                    // const chatBox = new ChatBoxModel({ name: chatBoxName, users: [name, to] });
                    // chatBox.save()

                    const user1 = await validateUser(name);
                    const user2 = await validateUser(to);
                    const box = await validateChatBox(chatBoxName, [user1, user2])
                    // await user1.chatBoxes.push(box._id)
                    // await user1.save()
                    // await user2.chatBoxes.push(box._id)
                    // await user2.save()
                    console.log(box)
                    const init_messages = []
                    box.messages.map((e) => {
                        init_messages.push({ name: e.sender.name, body: e.body })
                    })
                    console.log(init_messages)
                    sendData(["init", init_messages], ws);

                    break
                }
                case 'MESSAGE': {
                    // console.log(await ChatBoxModel.find())

                    console.log("now in msg")
                    const { name, to, body } = payload
                    const chatBoxName = makeName(name, to)

                    // Save payload to DB
                    const chatBox = await ChatBoxModel.findOne({ name: chatBoxName });
                    const sender = await UserModel.findOne({ name: name });
                    const message = new MessageModel({ chatBox: chatBox._id, sender: sender._id, body: body })
                    try {
                        await message.save();
                    } catch (e) {
                        throw new Error
                            ("Message DB save error: " + e);
                    }
                    chatBox.messages.push(message)
                    await chatBox.save()
                    // Respond to client
                    broadcastMessage(
                        wss,
                        ['output', [{ name, body }]],
                        {
                            type: 'success',
                            msg: 'Message sent.'
                        })

                    break
                }
                case 'CLEAR': {
                    Message.deleteMany({}, () => {
                        broadcastMessage(
                            wss,
                            ['cleared'],
                            {
                                type: 'info',
                                msg: 'Message cache cleared.'
                            })
                    })
                    break
                }

                case 'input': {
                    const { name, body } = payload
                    // Save payload to DB
                    const message = new Message({ name, body })
                    try {
                        await message.save();
                    } catch (e) {
                        throw new Error
                            ("Message DB save error: " + e);
                    }
                    // Respond to client
                    broadcastMessage(
                        wss,
                        ['output', [payload]],
                        {
                            type: 'success',
                            msg: 'Message sent.'
                        })

                    break
                }
                case 'clear': {
                    Message.deleteMany({}, () => {
                        broadcastMessage(
                            wss,
                            ['cleared'],
                            {
                                type: 'info',
                                msg: 'Message cache cleared.'
                            })
                    })
                    break
                }
                default: break
            }
        }
    )
}