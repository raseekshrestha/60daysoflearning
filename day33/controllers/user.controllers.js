import asyncHandler from 'express-async-handler';
import { readJsonFile, writeJsonFile } from '../utils/rwJson.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { generateAccessToken, gethash } from '../utils/utils.js';
import bcrypt from 'bcrypt';

const registerUser = asyncHandler(async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) throw new ApiError(400, "password and confirm password must match")

    const users = await readJsonFile("json/users.json");

    // used _id as index for user to make searching by email easier in O(1)
    const _id = gethash(email);


    if (!users[_id]) {
        users[_id] = { email, password: await bcrypt.hash(password, 10) };
        await writeJsonFile("json/users.json", users)
        const payload = {
            _id,
            email,
            admin: email == "admin@gmail.com"
        }
        const token = generateAccessToken(payload);
        res.json(new ApiResponse(201, "Registered successfully", { token, ...payload }))

    } else {
        throw new ApiError(400, 'email already registered!')
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const _id = gethash(email);

    const users = await readJsonFile("json/users.json");
    if (!users[_id]) throw new ApiError(400, "email not registered yet");

    const user = users[_id];
    if (await bcrypt.compare(password, user.password)) {
        const payload = {
            _id,
            email,
            admin: email == "admin@gmail.com"
        }
        const token = generateAccessToken(payload);
        res.status(200).json(new ApiResponse(200, "login successful", { token, ...payload }))
    } else {
        throw new ApiError(401, "email or password invalid");
    }
})

export { registerUser, loginUser }