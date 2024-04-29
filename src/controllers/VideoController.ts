import { VideoService } from "../services/VideoService";

export class VideoController {
  async execute() {
    const videoService = new VideoService();

    videoService.create();
  }
}
