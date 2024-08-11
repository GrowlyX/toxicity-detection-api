import express, {Request, Response} from "express";
import http from "http";
import {loadAndPredict} from "./model/model";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const setupRoutes = (app: express.Application) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/', async (req: Request, res: Response) => {
        return res.status(200)
    });

    app.post('/predict', async (req: Request, res: Response) => {
        const prediction = await loadAndPredict(req.body.message)
        return res.json({
            prediction: prediction
        })
    });
}

export const startToxicityServer = async (): Promise<void> => {
    try {
        http.createServer(app).listen(4000, () => {
            console.log("Server started on port 4000");
            setupRoutes(app);
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
