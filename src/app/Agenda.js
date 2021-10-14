const Agenda = require("agenda");

// const mongoConnectionString = process.env.DATABASE;

// const agenda = new Agenda({ db: { address: mongoConnectionString } });

// agenda.on("start", async (job) => {
//     const { token } = job.attrs.data;
//     log.info(` [BOT 🏀] => Job ${job.attrs.name} starting`);
//     sendMessage({token, message: 'Okay'});
// });

// agenda.on("fail:send status", (err, job) => {
//     console.log(`Job failed with error: ${err.message}`);
//   });

// agenda.define("send status",(job) => { 
//     console.log("send status");
// });


// await agenda.start();
    // await agenda.every("1 hour", "send status", { token });