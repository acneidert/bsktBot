const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const MONTHS = [
  'JAN', 'FEV', 'MAR', 'ABR',
  'MAI', 'JUN', 'JUL', 'AGO',
  'SET', 'OUT', 'NOV', 'DEZ',
];

const Chat = mongoose.model(
  'Chat',
  mongoose.Schema({
    chatId: String,
    active: { type: Boolean, default: true },
    schedule: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule',
      },
    ],
  })
);

const Schedule = mongoose.model(
  'Schedule',
  mongoose.Schema({
    where: String,
    when: String,
    value: Number,
    who_insert: String,
    active: { type: Boolean, default: true },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
    },
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
  })
);

const Payment = mongoose.model(
  'Payment',
  mongoose.Schema({
    who: String,
    month: {
      type: String,
      enum: MONTHS,
    },
    canceled: { type: Boolean, default: false },
    date_insert: { type: Date, default: Date.now },
    who_insert: String,
    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Schedule',
    },
  })
);

module.exports = {
  Chat,
  Payment,
  Schedule,
  MONTHS,
};
