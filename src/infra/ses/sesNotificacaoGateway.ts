import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { NotificacaoGateway } from "../../dominio/gateway/notificacaoGateway";

export class SesNotificacaoGateway implements NotificacaoGateway {
  private readonly client: SESClient;
  private readonly remetente: string;

  private constructor() {
    this.client = new SESClient({ region: process.env.AWS_REGION ?? "us-east-1" });
    this.remetente = process.env.SES_FROM_EMAIL ?? "noreply@black-interlude.store";
  }

  public static criar(): SesNotificacaoGateway {
    return new SesNotificacaoGateway();
  }

  public async enviarConfirmacao(endereco: string): Promise<void> {
    const command = new SendEmailCommand({
      Source: this.remetente,
      Destination: { ToAddresses: [endereco] },
      Message: {
        Subject: {
          Data: "// ACCESS REGISTERED — BLACK INTERLUDE",
          Charset: "UTF-8",
        },
        Body: {
          Html: { Data: this.gerarHtml(), Charset: "UTF-8" },
          Text: { Data: this.gerarTexto(), Charset: "UTF-8" },
        },
      },
    });

    await this.client.send(command);
  }

  private gerarHtml(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ACCESS REGISTERED</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0a0a;padding:56px 24px 64px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

          <!-- Top label -->
          <tr>
            <td style="padding-bottom:48px;border-bottom:1px solid #1e1e1e;">
              <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:0.22em;color:#444444;text-transform:uppercase;">
                // TRANSMISSION RECEIVED
              </p>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td style="padding-top:48px;padding-bottom:40px;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',Times,serif;font-size:44px;font-weight:300;font-style:italic;letter-spacing:0.08em;color:#e8e8e8;line-height:1.1;">
                BLACK INTERLUDE
              </h1>
            </td>
          </tr>

          <!-- Body text -->
          <tr>
            <td style="padding-bottom:40px;">
              <p style="margin:0 0 20px 0;font-family:Georgia,'Times New Roman',Times,serif;font-size:16px;line-height:1.75;color:#999999;">
                Your signal has been received.
              </p>
              <p style="margin:0;font-family:Georgia,'Times New Roman',Times,serif;font-size:16px;line-height:1.75;color:#999999;">
                When the first pieces are ready, you'll know.<br />
                No noise. No urgency. Just the signal.
              </p>
            </td>
          </tr>

          <!-- Status block -->
          <tr>
            <td style="padding-bottom:48px;">
              <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:0.18em;color:#555555;line-height:2.2;">
                ACCESS: CONFIRMED<br />
                FREQUENCY: IRREGULAR<br />
                SIGNAL: PRECISE
              </p>
            </td>
          </tr>

          <!-- Divider + Footer -->
          <tr>
            <td style="border-top:1px solid #1e1e1e;padding-top:32px;">
              <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:0.14em;color:#333333;line-height:1.9;">
                BLACK INTERLUDE — EST. 2026<br />
                SYSTEM ONLINE / CONTENT PENDING
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  private gerarTexto(): string {
    return `// TRANSMISSION RECEIVED

BLACK INTERLUDE

Your signal has been received.

When the first pieces are ready, you'll know.
No noise. No urgency. Just the signal.

ACCESS: CONFIRMED
FREQUENCY: IRREGULAR
SIGNAL: PRECISE

—

BLACK INTERLUDE — EST. 2026
SYSTEM ONLINE / CONTENT PENDING`;
  }
}
