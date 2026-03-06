import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        //temporary
        expiresIn: '3d',
    });
}