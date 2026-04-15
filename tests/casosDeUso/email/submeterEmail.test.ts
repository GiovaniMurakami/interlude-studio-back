import { SubmeterEmail } from "../../../src/casosDeUso/email/submeterEmail";
import { EmailGateway } from "../../../src/dominio/gateway/emailGateway";
import { Email } from "../../../src/dominio/entidade/email";
import { ErroPersonalizado } from "../../../src/helpers/error/ErroPersonalizado";

const makeGateway = (override: Partial<EmailGateway> = {}): EmailGateway => ({
  salvar: jest.fn().mockResolvedValue(undefined),
  buscarPorEndereco: jest.fn().mockResolvedValue(null),
  listar: jest.fn().mockResolvedValue([]),
  ...override,
});

describe("SubmeterEmail", () => {
  it("deve salvar um e-mail válido", async () => {
    const gateway = makeGateway();
    const caso = SubmeterEmail.criar(gateway);

    const resultado = await caso.executar({ endereco: "teste@exemplo.com" });

    expect(resultado.endereco).toBe("teste@exemplo.com");
    expect(resultado.id).toBeTruthy();
    expect(gateway.salvar).toHaveBeenCalledTimes(1);
  });

  it("deve normalizar o e-mail para lowercase", async () => {
    const gateway = makeGateway();
    const caso = SubmeterEmail.criar(gateway);

    const resultado = await caso.executar({ endereco: "TESTE@EXEMPLO.COM" });

    expect(resultado.endereco).toBe("teste@exemplo.com");
  });

  it("deve lançar erro se o e-mail já estiver cadastrado", async () => {
    const emailExistente = new Email({
      id: "uuid-existente",
      endereco: "duplicado@exemplo.com",
      criadoEm: new Date(),
    });

    const gateway = makeGateway({
      buscarPorEndereco: jest.fn().mockResolvedValue(emailExistente),
    });
    const caso = SubmeterEmail.criar(gateway);

    await expect(caso.executar({ endereco: "duplicado@exemplo.com" })).rejects.toBeInstanceOf(
      ErroPersonalizado
    );
    expect(gateway.salvar).not.toHaveBeenCalled();
  });
});
