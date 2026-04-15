import { Email } from "../entidade/email";

export interface EmailGateway {
  salvar(email: Email): Promise<void>;
  buscarPorEndereco(endereco: string): Promise<Email | null>;
  listar(): Promise<Email[]>;
}
