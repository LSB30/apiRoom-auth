import { z, ZodError } from "zod";
import { Response } from "express";
import { roomRepository } from "../../repositories/roomRepository";
const roomSchema = z.object({
  name: z
    .string({
      required_error: "O nome é obrigatório",
      invalid_type_error: "O campo deve ser uma string",
    })
    .min(3, {
      message: "O nome precisa de 3 caracteres",
    })
    .trim()
    .transform((name) => name.toLocaleUpperCase())
    .refine((name) => name.trim() !== "", {
      message: "O campo nome não pode ser apenas espaços em branco",
    })
    .refine((name) => !/\s/.test(name), {
      message: "O campo nome não pode conter espaços no meio",
    }),

  description: z
    .string({
      required_error: "Description é obrigatório",
      invalid_type_error: "O campo deve ser uma string",
    })
    .min(3, {
      message: "O campo precisa de 3 caracteres",
    })
    .trim()
    .transform((description) => description.toLocaleUpperCase())
    .refine((description) => description.trim() !== "", {
      message: "O campo description não pode ser apenas espaços em branco",
    }),
});

type Room = z.infer<typeof roomSchema>;

interface ValidationError {
  message: string; // Mensagem de erro
  path: (string | number)[]; // Caminho do campo que causou o erro
}

export class RoomServices {
  async create(room: Room, res: Response) {
    try {
      const { name, description } = roomSchema.parse(room);

      const newRoom = roomRepository.create({ name, description });

      await roomRepository.save(newRoom);

      return res
        .status(201)
        .json({ message: "Sala criada com sucesso", sala: newRoom });
        
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
