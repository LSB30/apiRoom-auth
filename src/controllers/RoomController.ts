import Express from "express";
import { RoomServices } from "../services/RoomServices";

export class RoomController {
  async create(req: Express.Request, res: Express.Response) {
    const roomService = new RoomServices();

    roomService.create(req, res);
  }
}
