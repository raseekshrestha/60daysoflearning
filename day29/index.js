import * as cheerio from "cheerio";
import axios from 'axios';
import https from 'https';
import { createInterface } from "readline";
import { table } from 'table';

const tableData = []

const agent = new https.Agent({
    rejectUnauthorized: false
});
const axiosInstance = axios.create({
    httpsAgent: agent
});

async function get(symbol, dob) {
    const url = "https://see.ntc.net.np/results/gradesheet";

    const formData = new FormData();
    formData.append("symbol", symbol);
    formData.append("dob", dob);
    formData.append("submit", "Search Result");

    const config = {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }
    try {
        const resp = await axiosInstance.post(url, formData, config);
        return await resp.data;

    } catch (err) {
        console.log(err);
        process.exit();
    }
}

const readline = createInterface({
    input: process.stdin,
    output: process.stdout
});

const takeInput = (message) => {
    return new Promise((resolve) => {
        readline.question(message, (data) => {
            resolve(data);
        });
    });
}

const main = async () => {
    try {
        const symbol = await takeInput("Enter Your Symbol: ");
        const dob = await takeInput("dob(YYYY-MM-DD): ");
        readline.close();
        await call(symbol, dob);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function call(symbol, dob) {
    const html = await get(symbol, dob);

    const $ = cheerio.load(html);
    const tbody = $("tbody table");

    if (tbody.length === 0) {
        console.error("No table found in the HTML content");
        return;
    }

    tbody.find("tr").each((i, tr) => {
        if (i === 1) {
            const thead = [];
            $(tr).find("td").each((i, td) => thead.push($(td).text()));
            tableData.push(thead);
        }
        if (i >= 2 && i < 16) {
            const tableRow = [];
            $(tr).find("td").each((i, td) => {
                tableRow.push($(td).text().trim());
            });
            tableData.push(tableRow);
        }
    });


    if (tableData.length === 0) {
        console.error("No data found in the table");
        return;
    }

    console.log(table(tableData));
}

main();
