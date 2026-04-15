import { Email } from "../../dominio/entidade/email";
import { EmailGateway } from "../../dominio/gateway/emailGateway";
import { NotificacaoGateway } from "../../dominio/gateway/notificacaoGateway";
import { CasoDeUso } from "../casoDeUso";
import { ErroPersonalizado } from "../../helpers/error/ErroPersonalizado";
import { StatusErro } from "../../helpers/error/statusErro";

export type SubmeterEmailInputDto = {
  endereco: string;
};

export type SubmeterEmailOutputDto = {
  id: string;
  endereco: string;
  criadoEm: Date;
};

export class SubmeterEmail implements CasoDeUso<SubmeterEmailInputDto, SubmeterEmailOutputDto> {
  private constructor(
    private readonly emailGateway: EmailGateway,
    private readonly notificacaoGateway: NotificacaoGateway,
  ) {}

  public static criar(emailGateway: EmailGateway, notificacaoGateway: NotificacaoGateway): SubmeterEmail {
    return new SubmeterEmail(emailGateway, notificacaoGateway);
  }

  public async executar(input: SubmeterEmailInputDto): Promise<SubmeterEmailOutputDto> {
    const enderecoNormalizado = input.endereco.toLowerCase().trim();

    const emailExistente = await this.emailGateway.buscarPorEndereco(enderecoNormalizado);
    if (emailExistente) {
      throw ErroPersonalizado.criar({
        mensagem: "Este e-mail já está cadastrado.",
        status: StatusErro.erroParametro,
      });
    }

    const email = Email.criar({ endereco: enderecoNormalizado });
    await this.emailGateway.salvar(email);
    await this.notificacaoGateway.enviarConfirmacao(enderecoNormalizado);

    return {
      id: email.id,
      endereco: email.endereco,
      criadoEm: email.criadoEm,
    };
  }
}
