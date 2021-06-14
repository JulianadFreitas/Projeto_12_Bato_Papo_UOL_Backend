import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.json());
let participants = [];
let messagesInfos = [];
let dataMessage = {};

app.post("/participants", (req, res) => {
    const userName = req.body;

    const participant = {
        name: userName.name,
        lastStatus: Date.now()
    }

    if (!participants.some(({ name }) => name === participant.name)) {
        participants.push(participant);

        messagesInfos.push(
            {
                from: participant.name,
                to: 'Todos',
                text: 'entra na sala...',
                type: 'status',
                time: dayjs().format('HH:mm:ss')
            }
        );
        return res.sendStatus(200);
    } res.sendStatus(400);

});

app.get("/participants", (req, res) => {
     res.send(participants);
});

app.post("/messages", (req, res) => {
    const headerOfMessages = req.headers;
    const userMessages = req.body;
    dataMessage = {
        from: headerOfMessages.user,
        to: userMessages.to,
        text: userMessages.text,
        type: userMessages.type,
        time: dayjs().format('HH:mm:ss')
    };
    const participant = participants.find((e) => e.name === dataMessage.from);
    if ((participant) && (dataMessage.to !== "") && dataMessage.type === "message" || dataMessage.type === "private_message") {
        messagesInfos.push(dataMessage);
        return res.sendStatus(200)
    } else res.sendStatus(400)

});

app.get("/messages", (req, res) => {
    const limit = req.query.limit;
    limit ? res.send(messagesInfos.slice(-limit)) : res.send(messagesInfos);
});

app.post("/status", (req, res) => {
    const user = req.header('User');
    const participant = participants.find((e, i) => e.name === user);
    participant ? participant.lastStatus = Date.now() && res.sendStatus(200) : res.sendStatus(400);
});


setInterval(() => {

    participants = participants.filter(element => {
        if ((Date.now() - element.lastStatus) < 10000) {
            return true
        }
        else {
            messagesInfos.push({ from: element.name, to: 'Todos', text: 'sai da sala...', type: 'status', time: dayjs().format('HH:mm:ss') })
            return false
        }
    })

}, 50000)


app.listen(4000);
