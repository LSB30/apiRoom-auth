import Express from "express";
import subject from "./subjectRoutes";
import room from "./roomRoutes";

const routes = (app: Express.Application) => {
  app.use(Express.json(), subject, room);
};

export default routes;