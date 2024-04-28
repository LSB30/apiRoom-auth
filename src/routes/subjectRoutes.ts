import { Router } from "express";
import { SubjectController } from "../controllers/subjectController/SubjectController";

const routes = Router();

routes.post("/subject", new SubjectController().execute);

export default routes;
