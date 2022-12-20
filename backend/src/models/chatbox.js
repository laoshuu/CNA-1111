import mongoose from 'mongoose';
const Schema = mongoose.Schema

/******* User Schema *******/
const UserSchema = new Schema({
    name: { type: String, required: [true, 'Name field is required.'] },
    password: { type: String, required: [true, 'Password field is required.'] },
    money: { type: Number, required: [true, 'Money field is required.'] },
    mailbox: [{ type: mongoose.Types.ObjectId, ref: 'Mail' }]
});

const UserModel = mongoose.model('User', UserSchema);

/******* Bet Schema *******/
const BetSchema = new Schema({
    title: { type: String, required: [true, 'Title field is required.'] },
    // est_time: { type: Date },
    // end_time: { type: Date },
    challenger: { type: mongoose.Types.ObjectId, ref: 'User' },
});

const BetModel = mongoose.model('Bet', BetSchema);

/******* Choice Schema *******/
const ChoiceSchema = new Schema({
    bet_id: { type: mongoose.Types.ObjectId, ref: 'Bet' },
    name: { type: String, required: [true, 'Name field is required.'] },
    // money: { type: Number, required: [true, 'Money field is required.'] },
    // num_people: { type: Number, required: [true, 'Money field is required.'] }
});

const ChoiceModel = mongoose.model('Choice', ChoiceSchema);

/******* UserChoice Schema *******/
const UserChoiceSchema = new Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    // choice: { type: mongoose.Types.ObjectId, ref: 'Choice' },
    bet_id: { type: mongoose.Types.ObjectId, ref: 'Bet' },
    choice: { type: String, required: [true, 'Name field is required.'] },
    bet_money: { type: Number, required: [true, 'Money field is required.'] },

});

const UserChoiceModel = mongoose.model('UserChoice', UserChoiceSchema);

/******* Mail Schema *******/
const MailSchema = new Schema({
    bet_title: { type: String, required: [true, 'Bet title field is required.'] },
    bet_challenger: { type: String, required: [true, 'Bet challenger field is required.'] },
    result: { type: String, required: [true, 'Result field is required.'] },
    spent: { type: Number, required: [true, 'Money field is required.'] },
    earn: { type: Number, required: [true, 'Money field is required.'] },
});

const MailModel = mongoose.model('Mail', MailSchema);

module.exports = { UserModel, BetModel, UserChoiceModel, MailModel };