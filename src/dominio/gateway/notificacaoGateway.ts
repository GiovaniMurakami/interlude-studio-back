export interface NotificacaoGateway {
  enviarConfirmacao(endereco: string): Promise<void>;
}
