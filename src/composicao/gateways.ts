import { SesNotificacaoGateway } from "../infra/ses/sesNotificacaoGateway";

export function criarGateways() {
  return {
    notificacao: SesNotificacaoGateway.criar(),
  };
}

export type Gateways = ReturnType<typeof criarGateways>;
