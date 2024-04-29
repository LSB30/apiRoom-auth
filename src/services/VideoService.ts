import { z, ZodError } from "zod";
import Express from "express";
import { videoRepository } from "../repositories/videoRepository";
import { roomRepository } from "../repositories/roomRepository";

const VideoSchema = z.object({
  title: z
    .string({
      required_error: "O title é obrigatório",
      invalid_type_error: "O campo deve ser uma string",
    })
    .min(3, {
      message: "O title precisa de 3 caracteres no minímo",
    })
    .trim()
    .transform((name) => name.toLocaleUpperCase())
    .refine((name) => name.trim() !== "", {
      message: "O campo title não pode ser apenas espaços em branco",
    }),

  url: z
    .string()
    .url()
    .transform((name) => name.toLocaleUpperCase())
    .refine((name) => name.trim() !== "", {
      message: "O campo url não pode ser apenas espaços em branco",
    })
    .refine((name) => !/\s/.test(name), {
      message: "O campo url não pode conter espaços no meio",
    }),

  idRoom: z.number({
    required_error: "O id é obrigatório",
    invalid_type_error: "O campo deve ser um number",
  }),
});

type Video = z.infer<typeof VideoSchema>;

interface ValidationError {
  message: string; // Mensagem de erro
  path: (string | number)[]; // Caminho do campo que causou o erro
}

export class VideoService {
  async create(req: Express.Request, res: Express.Response) {
    const { title, url, idRoom }: Video = VideoSchema.parse(req.body);

    try {
      const room = await roomRepository.findOneBy({
        id: idRoom,
      });

      if (!room) {
        return res.status(404).json({ message: "Sala não existe" });
      }

      const newVideo = videoRepository.create({ title, url, room });

      await videoRepository.save(newVideo);

      console.log(newVideo);

      return res
        .status(201)
        .json({ message: "Video criado com sucesso", Video: newVideo });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError: ValidationError[] = error.errors.map((err) => ({
          message: err.message,
          path: err.path,
        }));

        return res
          .status(400)
          .json({ error: "Erro de validação", details: validationError });
      } else {
        res.status(500).json({ error: "Erro interno do Servidor" });
      }
    }
  }
}
