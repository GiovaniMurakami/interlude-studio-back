import { v4 as uuidv4 } from "uuid";

type EmailProps = {
  id: string;
  endereco: string;
  criadoEm: Date;
};

export class Email {
  public readonly id: string;
  public readonly endereco: string;
  public readonly criadoEm: Date;

  constructor(props: EmailProps) {
    this.id = props.id;
    this.endereco = props.endereco;
    this.criadoEm = props.criadoEm;
  }

  public static criar(props: { endereco: string }): Email {
    return new Email({
      id: uuidv4(),
      endereco: props.endereco.toLowerCase().trim(),
      criadoEm: new Date(),
    });
  }
}
