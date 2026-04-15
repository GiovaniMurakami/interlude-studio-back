import { SubmeterEmail } from "../casosDeUso/email/submeterEmail";
import { type Repositorios } from "./repositorios";
import { type Gateways } from "./gateways";

export function criarCasosDeUso(repos: Repositorios, gateways: Gateways) {
  return {
    submeterEmail: SubmeterEmail.criar(repos.email, gateways.notificacao),
  };
}

export type CasosDeUso = ReturnType<typeof criarCasosDeUso>;
