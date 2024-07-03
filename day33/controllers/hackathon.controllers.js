import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import { readJsonFile, writeJsonFile } from '../utils/rwJson.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';


const createHackathon = asyncHandler(async (req, res) => {
    const { title, description, startDate, endDate, prizePool, registrationFee } = req.body;

    let uuid = uuidv4();

    const hackathons = await readJsonFile("json/hackathons.json");

    while (hackathons[uuid]) {
        uuid = uuidv4();
    }
    hackathons[uuid] = { title, description, startDate, endDate, registrationFee: registrationFee || 0, prizePool }

    await writeJsonFile("json/hackathons.json", hackathons)

    res.json(new ApiResponse(201, "New hackathon created", { _id: uuid, ...hackathons[uuid] }));

})

const getHackathons = asyncHandler(async (req, res) => {
    const hackathons = await readJsonFile("json/hackathons.json");
    const structuredHackathons = [];
    for (let key in hackathons) {
        structuredHackathons.push({ _id: key, ...hackathons[key] })
    }
    res.json(new ApiResponse(200, "fetching succesful", structuredHackathons))

})

const getSingleHackathon = asyncHandler(async (req, res) => {
    const hackathonId = req.params.hackathonId;
    const hackathons = await readJsonFile("json/hackathons.json");
    if (!hackathons[hackathonId]) throw new ApiError(404, "Hackathon not found");
    res.json(new ApiResponse(200, "Hackathon found!", hackathons[hackathonId]))
})

const editHackathon = asyncHandler(async (req, res) => {
    const { title, description, startDate, endDate, prizePool, registrationFee } = req.body;
    const hackathonId = req.params.hackathonId;
    const hackathons = await readJsonFile("json/hackathons.json");
    if (!hackathons[hackathonId]) throw new ApiError(404, "Hackathon not found");

    // modify data;
    hackathons[hackathonId] = {
        title,
        description,
        startDate,
        endDate,
        prizePool,
        registrationFee: registrationFee || hackathons[hackathonId].registrationFee
    }
    await writeJsonFile("json/hackathons.json", hackathons);
    res.json(new ApiResponse(200, "Edit successful", { _id: hackathonId, ...hackathons[hackathonId] }))


})

const deleteHackathon = asyncHandler(async (req, res) => {
    const hackathonId = req.params.hackathonId;
    const hackathons = await readJsonFile("json/hackathons.json");
    if (!hackathons[hackathonId]) throw new ApiError(404, "Hackathon not found");

    delete hackathons[hackathonId]

    await writeJsonFile("json/hackathons.json", hackathons);

    res.json(new ApiResponse(200, "Deleted successfully"));
})

const teamInfoFormatValidator = (teamInfo) => {
    /**
     * teamInfo format should follow this
     {
        name: 'dear hacker',
        hackers: [
            { name: 'ram', email: 'ram@ram.com', contact: 9861437533 },
            { name: 'shyam', email: 'shyam@ram.com', contact: 9812345678 }
        ]
    }

     */

    if (typeof teamInfo !== 'object') return false;
    const teamInfoProps = ['name', 'hackers'];

    if (!teamInfoProps.every(field => field in teamInfo)) return false;

    if (!Array.isArray(teamInfo.hackers)) return false;

    const hackerProps = ['name', 'email', 'contact'];

    for (let hacker of teamInfo.hackers) {
        if (typeof hacker !== 'object') return false;
        if (!hackerProps.every(field => field in hacker)) return false;
    }

    // At this point teamInfo format looks okay
    return true



}

const registerForHackathon = asyncHandler(async (req, res) => {
    const { hackathonId, teamInfo } = req.body;
    console.log(teamInfo)


    const hackathons = await readJsonFile("json/hackathons.json");
    if (!hackathons[hackathonId]) throw new ApiError(404, "Hackathon not found");

    if (!teamInfoFormatValidator(teamInfo)) {
        throw new ApiError(400, "teamInfo format error");
    }
    if (teamInfo.hackers.length < 3 || teamInfo.hackers.length > 4) {
        throw new ApiError(400, "Invalid team member count min:3 max:4")
    }

    const hackers = await readJsonFile("json/teams.json");
    let uuid = uuidv4();
    while (hackers[uuid]) {
        uuid = uuidv4();
    }
    hackers[uuid] = { hackathonId, teamInfo, registeredBy: req.user.email };
    console.log("user is ", req.user.email);

    await writeJsonFile("json/teams.json", hackers);

    res.json(new ApiResponse(201, 'Registered successfully'))

})

const getRegisteredTeams = asyncHandler(async (req, res) => {
    const hackathonId = req.params.hackathonId;
    const hackathons = await readJsonFile("json/hackathons.json");
    if (!hackathons[hackathonId]) throw new ApiError(404, "Hackathon not found");

    let teams = await readJsonFile("json/teams.json");
    let filteredTeams = {}
    for (let index in teams) {
        if (teams[index].hackathonId == hackathonId) {
            filteredTeams[index] = teams[index]
        }
    }
    res.json(new ApiResponse(200, "the teams is shere", filteredTeams))

})

const deleteRegisteredTeam = asyncHandler(async (req, res) => {
    const teamId = req.params.teamId;
    console.log(teamId)

    const teams = await readJsonFile("json/teams.json");
    if (!teams[teamId]) throw new ApiError(400, "That team does not exists");

    if (req.user.email !== teams[teamId].registeredBy) {
        throw new ApiError(403, "Not Your Team to delete")
    }

    //if team exists and user have valid permission to delte team
    delete teams[teamId]

    await writeJsonFile("json/teams.json", teams);
    res.send(new ApiResponse(200, "Deleted Successfully"))


})

export {
    createHackathon,
    getHackathons,
    getSingleHackathon,
    editHackathon,
    deleteHackathon,
    registerForHackathon,
    getRegisteredTeams,
    deleteRegisteredTeam
};