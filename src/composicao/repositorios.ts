import { EmailRepositorio } from "../infra/mongodb/repositorios/emailRepositorio";

export function criarRepositorios() {
  return {
    email: EmailRepositorio.criar(),
  };
}

export type Repositorios = ReturnType<typeof criarRepositorios>;
