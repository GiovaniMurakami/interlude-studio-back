import { NextFunction, Request, Response, RequestHandler } from "express";
import { SubmeterEmail } from "../../../../../casosDeUso/email/submeterEmail";
import { HttpMethod, Rotas } from "../rotas";
import { ErroPersonalizado } from "../../../../../helpers/error/ErroPersonalizado";
import { rateLimiterEmail } from "../../../../../middlewares/express/rateLimiterEmail";
import { z } from "zod";

const submeterEmailSchema = z.object({
  endereco: z.string().email("E-mail inválido.").max(254),
});

export class SubmeterEmailRota implements Rotas {
  private constructor(
    private readonly caminho: string,
    private readonly metodo: HttpMethod,
    private readonly submeterEmailServico: SubmeterEmail
  ) {}

  public static criar(submeterEmailServico: SubmeterEmail): SubmeterEmailRota {
    return new SubmeterEmailRota("/email/submeter", HttpMethod.POST, submeterEmailServico);
  }

  public getCaminho(): string { return this.caminho; }
  public getMetodo(): HttpMethod { return this.metodo; }
  public getMiddlewares(): RequestHandler[] { return [rateLimiterEmail]; }

  public getHandler() {
    return async (
      request: Request,
      response: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const parsed = submeterEmailSchema.safeParse(request.body);
        if (!parsed.success) {
          const erros = parsed.error.errors.map((e) => e.message);
          response.status(400).json({ mensagem: "Dados inválidos.", erros });
          return;
        }

        const resultado = await this.submeterEmailServico.executar({
          endereco: parsed.data.endereco,
        });

        response.status(201).json(resultado);
      } catch (error) {
        if (error instanceof ErroPersonalizado) {
          response.status(error.status).json({ mensagem: error.message, erros: error.erros });
          return;
        }
        next(error);
      }
    };
  }
}
