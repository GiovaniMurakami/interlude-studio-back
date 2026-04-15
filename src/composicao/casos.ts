import { SubmeterEmail } from "../casosDeUso/email/submeterEmail";
import { type Repositorios } from "./repositorios";

export function criarCasosDeUso(repos: Repositorios) {
  return {
    submeterEmail: SubmeterEmail.criar(repos.email),
  };
}

export type CasosDeUso = ReturnType<typeof criarCasosDeUso>;
