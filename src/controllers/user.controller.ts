import {Request, Response, Router} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import User from '../models/user';
import {ErrorHandler, handleError} from '../error';
import body_user_validations from '../middlewares/user/user.validator';
import validation_handler from '../middlewares/validator';

const router = Router();

// ============
// POST
// Register an User
// Public
// ============

router.post('/',body_user_validations, validation_handler, async(req: Request, res: Response) => {
    const {name, email, password}= req.body;
    try{
        let user = await User.findOne({email});
        if(user){
            const custom = new ErrorHandler(400, 'User already exists');
            handleError(custom, req, res);
        }

        user = new User({
            name,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwt_secret'), {expiresIn: 3600}, (err, token) => {
            if(err) throw err;
            res.status(200).json({
                data: {token},
                msj: 'User Created'
            });
        });
    }catch(err){
        const custom = new ErrorHandler(500, 'Server Error');
        handleError(custom, req, res);
    }
})

export default router;