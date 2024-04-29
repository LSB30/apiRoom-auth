import { z, ZodError } from "zod";
import { subjectRepository } from "../repositories/subjectRepository";
import Express from "express";

const subjectSchema = z.object({
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
});

type Subject = z.infer<typeof subjectSchema>;

interface ValidationError {
  message: string; // Mensagem de erro
  path: (string | number)[]; // Caminho do campo que causou o erro
}

export class SubjectService {
  async create(req: Express.Request, res: Express.Response) {
    
    const { name }: Subject = subjectSchema.parse(req.body);

    try {
      const newSubject = subjectRepository.create({ name });

      await subjectRepository.save(newSubject);

      console.log(newSubject);

      return res.status(201).json({
        message: "Disciplina criada com sucesso",
        Disciplina: newSubject,
      });
    } catch (error) {
      console.log(error);

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
