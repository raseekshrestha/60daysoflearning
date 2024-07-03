import express from 'express';
import { fieldValidator } from '../middlewares/fieldValidator.middlewares.js';
import { validateUser } from '../middlewares/validateUser.middlewares.js';
import {
    createHackathon,
    getHackathons,
    editHackathon,
    getSingleHackathon,
    deleteHackathon,
    registerForHackathon,
    getRegisteredTeams,
    deleteRegisteredTeam
} from '../controllers/hackathon.controllers.js';


const router = express.Router();


// create new hackathon
router.post(
    "/",
    fieldValidator(['title', 'description', 'startDate', 'endDate', 'prizePool']),
    validateUser(true),
    createHackathon
)


// gets all hackathons
router.get("/", getHackathons);


// register for a hackathon
router.post("/registration", validateUser(), registerForHackathon);

router.get("/registeredteams/:hackathonId", getRegisteredTeams);

router.delete("/deleteregisteredteam/:teamId", validateUser(false), deleteRegisteredTeam);


router.get("/:hackathonId", getSingleHackathon);

// edit hackathon
router.put(
    "/:hackathonId",
    validateUser(true),
    fieldValidator(['title', 'description', 'startDate', 'endDate', 'prizePool']),
    editHackathon,
)

router.delete("/:hackathonId", validateUser(true), deleteHackathon);

export default router;