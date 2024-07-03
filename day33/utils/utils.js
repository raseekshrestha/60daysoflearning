import crypto from 'crypto';
import jwt from 'jsonwebtoken';


const gethash = (str) => {
    return crypto.createHash('sha256').update(str).digest('hex');
}

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })
}

export { gethash, generateAccessToken };