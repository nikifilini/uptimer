"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const util = require('util');
const exec = util.promisify(require('child_process').exec);
require('dotenv').config();
const onError = async () => {
    const { stdout, stderr } = await exec(process.env.RESTRT_CMD);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
};
const sendAlert = async (msg) => {
    if (!process.env.TELEGRAM_API_KEY || !process.env.TELEGRAM_CHAT_ID)
        return;
    await axios_1.default
        .post(`https://api.telegram.org/bot${process.env.TELEGRAM_API_KEY}/sendMessage`, {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: msg,
    })
        .catch((err) => {
        console.error('Failed to send telegram message');
        console.error(err.response.data);
    });
};
const main = async () => {
    if (!process.env.URL)
        throw new Error('URL not specified');
    try {
        const resp = await axios_1.default.get(process.env.URL);
        console.log(`OK - response code ${resp.status}`);
    }
    catch (_err) {
        const err = _err;
        const msg = `[${process.env.CODENAME}] ERROR - ${err.message}`;
        console.log(msg);
        await onError();
        await sendAlert(msg);
    }
};
main();
//# sourceMappingURL=index.js.map