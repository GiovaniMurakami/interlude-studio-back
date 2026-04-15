import mongoose, { Schema, Document } from "mongoose";
import { Email } from "../../../dominio/entidade/email";
import { EmailGateway } from "../../../dominio/gateway/emailGateway";
import { BaseRepositorio } from "./baseRepositorio";

interface EmailDocument extends Document {
  id: string;
  endereco: string;
  criadoEm: Date;
}

const emailSchema = new Schema<EmailDocument>(
  {
    id: { type: String, required: true, unique: true },
    endereco: { type: String, required: true, unique: true, lowercase: true, trim: true },
    criadoEm: { type: Date, default: Date.now },
  },
  { collection: "emails" }
);

emailSchema.index({ criadoEm: -1 });
emailSchema.index({ endereco: 1 });

const EmailModel =
  mongoose.models.Email || mongoose.model<EmailDocument>("Email", emailSchema);

function docParaEmail(doc: EmailDocument): Email {
  return new Email({
    id: doc.get("id"),
    endereco: doc.get("endereco"),
    criadoEm: doc.get("criadoEm"),
  });
}

export class EmailRepositorio extends BaseRepositorio implements EmailGateway {
  private constructor() { super(); }

  public static criar(): EmailRepositorio {
    return new EmailRepositorio();
  }

  public async salvar(email: Email): Promise<void> {
    await this.conectar();
    await EmailModel.create({
      id: email.id,
      endereco: email.endereco,
      criadoEm: email.criadoEm,
    });
  }

  public async buscarPorEndereco(endereco: string): Promise<Email | null> {
    await this.conectar();
    const doc = await EmailModel.findOne({ endereco: endereco.toLowerCase() });
    if (!doc) return null;
    return docParaEmail(doc as unknown as EmailDocument);
  }

  public async listar(): Promise<Email[]> {
    await this.conectar();
    const docs = await EmailModel.find().sort({ criadoEm: -1 });
    return docs.map((doc) => docParaEmail(doc as unknown as EmailDocument));
  }
}
