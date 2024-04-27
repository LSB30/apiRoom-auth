import Express from "express";
import { SubjectService } from "../services/SubjectServices";

export class SubjectController {
  async execute(req: Express.Request, res: Express.Response) {
    const subjectService = new SubjectService();

    subjectService.create(req.body, req, res);
  }
}
