import express, {Request, Response} from 'express';
import config from 'config';

const port = config.get('port');

const router = express.Router();

router.get('/',(rep: Request, res : Response) => {
    return res.status(200).json({
        server_up: true,
        port: port,
        enviroment: config.get('environment'),
        class: "clase 1"
    });
});

export default router;