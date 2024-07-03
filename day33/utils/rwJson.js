import fs from 'fs';

// read-write json file (rwJson)

const readJsonFile = async (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    // creates new file with the filePath if not exists
                    console.log("creating teams.json");
                    fs.writeFile(filePath, '{}', (err) => {
                        if (err) reject(err.message)
                    })
                    resolve({}) //sends empty object since file didnt existed before
                } else {
                    reject(err.message)
                }
            } else {
                resolve(JSON.parse(data))
            }
        })
    })
}

const writeJsonFile = async (filePath, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data, null, 4), (err) => {
            if (err) {
                reject(err.message)
            } else {
                resolve(1)
            }
        })
    })
}

export { readJsonFile, writeJsonFile }