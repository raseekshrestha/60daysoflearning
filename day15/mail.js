import Mailjs from "@cemalgnlts/mailjs";
import dbConnect from "./config/dbConfig.js";
import menu from 'node-menu';
import { exec } from 'child_process';
import tempUserModel from "./models/tempuser.model.js";
import os from 'os';

const originalLog = console.log
dbConnect()
console.log = originalLog

const mailjs = new Mailjs();

const createMail = async (username) => {

    const domains = await mailjs.getDomains()
    // console.log(domains)
    const randomDomain = Date.now() % domains.data.length
    const randomDomainUrl = domains.data[randomDomain].domain

    const docCount = await tempUserModel.countDocuments()

    const email = `${username}${docCount + 1}@${randomDomainUrl}`
    const password = "asmywish2"

    // console.log(email)
    const newmail = await mailjs.register(email, password);
    // console.log(newmail)
    if (!newmail.status) return "email creation failed";
    const login = await mailjs.login(email, password)
    if (!login.status) return "login failed"
    const token = login.data.token



    await tempUserModel.create({ email, password, uid: docCount + 1, token })

    copyToClipBoard(email)

    return email


}

const copyToClipBoard = (message) => {
    if (os.platform() == "linux") {
        exec(`printf ${message} | xclip -selection clipboard`, (err) => {
            if (err) {
                console.log("err", err)
            }
        })
    }
}


const individualMessage = async (id) => {

    const message = await mailjs.getMessage(id)
    menu.resetMenu()

    // console.log(message.data.text)
    if (message) {
        menu.customHeader(() => {
            console.log(message.data.text)
            console.log("------------------")
        })
        menu.addItem("go back").start()
    }
}

const showMessages = async (mail) => {

    let login;
    if (!mail.token) {
        login = await mailjs.login(mail.email, mail.password)
        if (!login.status) {
            console.log("login failed", login, mail)
            return "login failed"

        }
        const token = login.data.token
        mail.token = token
        // mail.save()
        await tempUserModel.findOneAndUpdate({ _id: mail._id }, mail)
    } else {
        login = await mailjs.loginWithToken(mail.token)
    }

    let messages = await mailjs.getMessages();
    menu.resetMenu();
    menu.addDelimiter('-', 33, 'Received Emails')
    menu.addDelimiter('-', 33, login.data.address)
    // console.log(messages.data[0].to)

    messages = messages.data;
    messages.forEach(message => {
        menu.addItem(message.subject, () => individualMessage(message.id))
    });
    menu.addItem("refresh", () => showMessages(mail)).addItem("go back", function () {
        menu.resetMenu();
        viewEmails()
    })
    menu.start()
}

const viewEmails = async () => {
    menu.addDelimiter('-', 33, 'Available Emails')

    const tempmail = await tempUserModel.find()

    if (tempmail.length == 0) {
        console.log("no such mail found")
        return "no mail found"
    }
    menu.resetMenu();
    tempmail.forEach(mail => {
        menu.addItem(
            mail.email,
            () => showMessages(mail)
        )
    });
    menu.addItem(
        "back to home",
        () => mainMenuCreator().start()
    )
    menu.start()
    return
}

function mainMenuCreator(message = null) {
    menu.customHeader(() => {
        if (message) {
            console.log("Note:", message)
        }
    })
    menu.disableDefaultPrompt()
    menu.resetMenu()
    menu.addDelimiter('-', 33, 'Main Menu')
    return menu.addItem(
        'Create Mail',
        async function (username) {
            const email = await createMail(username)
            mainMenuCreator(`new mail ${email} created`).start()

        },
        null,
        [
            { name: 'username', type: 'string' }
        ]
    ).addItem(
        "View Available Emails",
        () => viewEmails(),
        null,
    )
}



async function main() {
    mainMenuCreator().start()

}

main()

// createMail("raseek1")
// const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3MTY5MTUxOTIsInJvbGVzIjpbIlJPTEVfVVNFUiJdLCJhZGRyZXNzIjoic2hyZXN0aGEyMEBmdGhjYXBpdGFsLmNvbSIsImlkIjoiNjY1NjBiZjc0MjM4OThiZWQ3MDc0NzEyIiwibWVyY3VyZSI6eyJzdWJzY3JpYmUiOlsiL2FjY291bnRzLzY2NTYwYmY3NDIzODk4YmVkNzA3NDcxMiJdfX0.W2lk26UhWPrVzD-VDCK8MPMRxGhF_eum_dwbKfomgAOH06qBDTUkJ5VL_dVJmmYbd822UZDofby7NjxcSzsTvQ"
// const mailjs = new Mailjs();
// mailjs.loginWithToken(token)
//     .then(data => {
//         console.log("login data:", data)
//     })
// mailjs.getMessages()
//     .then(data => {
//         console.log("messages", data)
//     });
