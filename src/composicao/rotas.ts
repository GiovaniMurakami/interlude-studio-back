import { SubmeterEmailRota } from "../infra/api/express/rotas/email/submeterEmail.express.route";
import { HealthRota } from "../infra/api/express/rotas/health.express.route";
import { type CasosDeUso } from "./casos";

export function criarRotas(casos: CasosDeUso) {
  return [
    SubmeterEmailRota.criar(casos.submeterEmail),
    HealthRota.criar(),
  ];
}
