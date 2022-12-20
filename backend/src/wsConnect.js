import bcrypt from "bcrypt"
import mongoose from "mongoose";
import { UserModel, BetModel, UserChoiceModel, MailModel } from "./models/chatbox"

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
                    if (user.money < 5) {
                        sendData(["status", { type: "error", msg: "Not enough money!" }], ws)
                        console.log("Bet Creation Failed.")
                    }
                    else {
                        await UserModel.updateOne({ "name": user.name }, { $inc: { "money": -5 } })
                        const Bet = new BetModel({ title: title, challenger: user._id })
                        await Bet.save()

                        sendData(["status", { type: "info", msg: "$5 dollar spent" }], ws)
                        sendData(["MONEY", user.money - 5], ws)
                        broadcastMessage(
                            wss,
                            ['NEW_BET', { id: Bet._id, title: title, challenger: user.name }],
                            {
                                type: 'success',
                                msg: `New bet created by ${user.name}!`
                            })
                        console.log("Bet Created!")
                    }
                    break
                }
                case 'MAKE_BET': {
                    const { bet_id, username, choice_name, bet_money } = payload;
                    const user = await UserModel.findOne({ name: username })
                    // check enough money
                    if (user.money < bet_money) {
                        sendData(["status", { type: "error", msg: "Not enough money!" }], ws)
                        console.log("Bet Make Failed.")
                    }
                    else {
                        await UserModel.updateOne({ "name": user.name }, { $inc: { "money": -bet_money } })
                        const newBet = new UserChoiceModel({ user: user._id, bet_id: bet_id, choice: choice_name, bet_money: bet_money })
                        newBet.save()
                        const Bet = await BetModel.findOne({ _id: bet_id }).populate("challenger").then((res) => {
                            const maked_messages = { id: bet_id, title: res.title, challenger: res.challenger.name, money: bet_money, choice: choice_name }
                            sendData(["MAKE_BET", maked_messages], ws)
                        })
                        sendData(["status", { type: "info", msg: `$${bet_money} dollar spent` }], ws)
                        sendData(["MONEY", user.money - bet_money], ws)
                        console.log("Bet Made!")
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
                        console.log("New User Registered!")
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
                        if (!password_is_valid) {
                            sendData(["status", { type: "error", msg: "Wrong password" }], ws)
                            console.log("User Login Failed.")
                        }
                        else {
                            sendData(["LOGIN", true], ws)
                            sendData(["status", { type: "success", msg: "Successfully Login!" }], ws)

                            const messages = []
                            await BetModel.find().populate("challenger").then((res) => {
                                res.map((bet) => messages.push({ id: bet._id, title: bet.title, challenger: bet.challenger.name }))
                            });

                            const maked_messages = []
                            await UserChoiceModel.find({ user: user._id }).populate({ path: "bet_id", populate: "challenger" }).then((res) => {
                                console.log("res",res)
                                res.map((bet) => maked_messages.push({ id: bet.bet_id._id, title: bet.bet_id.title, challenger: bet.bet_id.challenger.name, money: bet.bet_money, choice: bet.choice }))
                            })

                            const maked_mails = []
                            await UserModel.findOne({ name: name }).populate({ path: 'mailbox' }).then((user) => {
                                user.mailbox.map((mail) => {
                                    maked_mails.push({ title: mail.bet_title, challenger: mail.bet_challenger, result: mail.result, spent: mail.spent, earned: mail.earn })
                                })
                            })

                            sendData(["MONEY", user.money], ws)
                            sendData(["ALLBETS", messages], ws)
                            sendData(["MADEBETS", maked_messages], ws)
                            sendData(["MAIL", maked_mails], ws)
                            console.log("User Login!")

                        }
                    }

                    break
                }
                case 'END_BET': {
                    const { name, bet_id, result } = payload;

                    let correct_num, wrong_num, correct_money, wrong_money, challenger_award;
                    const correct_choice = await UserChoiceModel.find({ bet_id: bet_id, choice: result })
                        .then((res) => correct_num = res.length)
                    const choices = await UserChoiceModel.find({ bet_id: bet_id })
                        .then((res) => wrong_num = res.length - correct_num)

                    await UserChoiceModel.aggregate([{ $match: { bet_id: new mongoose.Types.ObjectId(`${bet_id}`), choice: result } }
                        , { $group: { _id: null, amount: { $sum: '$bet_money' } } }
                    ]).then((res) => {
                        correct_money = (!res[0]) ? (0) : res[0].amount
                    })

                    await UserChoiceModel.aggregate([{ $match: { bet_id: new mongoose.Types.ObjectId(`${bet_id}`) } }
                        , { $group: { _id: null, amount: { $sum: '$bet_money' } } }
                    ]).then((res) => {
                        wrong_money = (!res[0]) ? (0) : res[0].amount - correct_money
                    })


                    // calculate correct_money, wrong_money
                    console.log("correct_money:", correct_money, "wrong money:", wrong_money)
                    if (result === 'Success') {
                        challenger_award = (correct_money + wrong_money) / (correct_num + 1)
                    }
                    else if (result === 'Fail') {
                        challenger_award = 0
                    }
                    console.log("challenger gets:", challenger_award)

                    // // challenger get rewards
                    let challenger, bet_title;
                    const Bet = await BetModel.findOne({ _id: bet_id }).then(async (bet) => {
                        challenger = bet.challenger
                        bet_title = bet.title
                        const mail = new MailModel({ bet_title: bet_title, bet_challenger: name, result: result, spent: 5, earn: challenger_award })
                        await UserModel.updateOne({ "_id": bet.challenger }, { $inc: { "money": challenger_award }, $push: { mailbox: mail._id } })
                        await mail.save()

                    })
                    // // Bet makers get rewards and everyone receive messages 
                    await UserChoiceModel.find({ bet_id: bet_id }).then((bets) => {
                        bets.map(async (bet) => {
                            console.log(bet)
                            if (bet.choice !== result) {
                                const mail = new MailModel({ bet_title: bet_title, bet_challenger: name, result: result, spent: bet.bet_money, earn: 0 })
                                await UserModel.updateOne({ "_id": bet.user }, { $push: { "mailbox": mail } })
                                await mail.save()
                            }
                            else {
                                const award = (correct_money + wrong_money - challenger_award) * bet.bet_money / correct_money
                                console.log("award", award)
                                const mail = new MailModel({ bet_title: bet_title, bet_challenger: name, result: result, spent: bet.bet_money, earn: award })
                                await UserModel.updateOne({ "_id": bet.user }, { $inc: { "money": award }, $push: { "mailbox": mail } })
                                await mail.save()
                            }
                        })
                    })

                    await BetModel.deleteMany({ _id: bet_id })
                    await UserChoiceModel.deleteMany({ bet_id: bet_id })


                    const messages = []
                    await BetModel.find().populate("challenger").then((res) => {
                        res.map((bet) => messages.push({ id: bet._id, title: bet.title, challenger: bet.challenger.name }))
                    });

                    // const maked_messages = []
                    // await UserChoiceModel.find({ user: challenger._id }).populate({ path: "bet_id", populate: "challenger" }).then((res) => {
                    //     res.map((bet) => maked_messages.push({ id: bet.bet_id._id, title: bet.bet_id.title, challenger: bet.bet_id.challenger.name, money: bet.bet_money, choice: bet.choice }))
                    // })



                    broadcastMessage(wss, ['ALLBETS', messages],
                        {
                            type: 'info',
                            msg: `Bet ${bet_title} closed.`
                        })
                    console.log("Bet Ended.")

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