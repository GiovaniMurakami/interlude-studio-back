import { ApiExpress } from "./infra/api/express/api.express";
import { criarRepositorios } from "./composicao/repositorios";
import { criarCasosDeUso } from "./composicao/casos";
import { criarRotas } from "./composicao/rotas";
import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["MONGODB_URI"] as const;
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Variável de ambiente obrigatória não definida: ${envVar}`);
  }
}

export function app() {
  const repos = criarRepositorios();
  const casos = criarCasosDeUso(repos);
  const rotas = criarRotas(casos);

  const port = Number(process.env.PORT) || 0;
  const api = ApiExpress.criar(rotas);
  api.start(port);

  return api.retornarAplicacao();
}
