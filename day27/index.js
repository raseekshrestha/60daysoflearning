import * as cheerio from "cheerio";
import axios from 'axios';
import https from 'https';
import { createInterface } from "readline";
import { create } from "domain";

const agent = new https.Agent({
    rejectUnauthorized: false
})
const axiosInstance = axios.create({
    httpsAgent: agent
})

async function get(symbol) {
    const url = "https://see.ntc.net.np/results/gpa";

    const formData = new FormData();
    formData.append("symbol", symbol)
    formData.append("submit", "Search Result")

    const config = {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }
    try {
        const resp = await axiosInstance.post(url, formData, config)
        return await resp.data

    } catch (err) {
        console.log(err)
        process.exit()
    }

}


const main = async () => {
    const readline = createInterface({
        input: process.stdin,
        output: process.stdout
    })

    readline.question("Enter Your Symbol: ", async (symbol) => {

        const $ = cheerio.load(await get(symbol));


        const gpa = $("table").find("table").find("tr:nth-child(2)").find("td:nth-child(2)").text().trim()
        console.log("GPA ", gpa)
        readline.close()
    })






}

main()