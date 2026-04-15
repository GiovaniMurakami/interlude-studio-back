# interlude-studio-back

API serverless para o [Interlude Studio](https://interlude.studio), responsável pela captura e persistência de e-mails de interesse. Construída com Node.js + TypeScript, implantada na AWS Lambda via Serverless Framework e com MongoDB Atlas como banco de dados.

---

## Arquitetura

O projeto segue os princípios de **Clean Architecture** com separação clara entre domínio, casos de uso, infraestrutura e composição.

```
src/
├── app.ts                        # Bootstrap da aplicação
├── handler.ts                    # Entrypoint AWS Lambda
├── iniciarServidor.ts            # Entrypoint servidor local
│
├── dominio/
│   ├── entidade/email.ts         # Entidade Email
│   └── gateway/emailGateway.ts  # Interface de repositório
│
├── casosDeUso/
│   └── email/submeterEmail.ts   # Caso de uso: submeter e-mail
│
├── infra/
│   ├── api/express/              # Adaptador HTTP (Express)
│   │   └── rotas/email/          # Rotas e validação Zod
│   └── mongodb/                  # Conexão e repositórios MongoDB
│
├── composicao/                   # Injeção de dependências manual
│   ├── repositorios.ts
│   ├── casos.ts
│   └── rotas.ts
│
├── middlewares/express/          # Sanitização de entrada (anti-XSS)
└── helpers/
    ├── error/                    # ErroPersonalizado + StatusErro
    └── logger.ts                 # Logger (pino)
```

---

## Endpoints

### `POST /email/submeter`

Registra um novo e-mail. Retorna `409` se já cadastrado.

**Request body:**
```json
{ "endereco": "usuario@exemplo.com" }
```

**Resposta 201:**
```json
{
  "id": "uuid-v4",
  "endereco": "usuario@exemplo.com",
  "criadoEm": "2026-04-15T00:00:00.000Z"
}
```

**Resposta 400** — campo ausente ou formato inválido:
```json
{ "mensagem": "Dados inválidos.", "erros": ["E-mail inválido."] }
```

**Resposta 400** — e-mail já cadastrado:
```json
{ "mensagem": "Este e-mail já está cadastrado." }
```

**Resposta 429** — limite de requisições excedido:
```json
{ "mensagem": "Muitas tentativas. Tente novamente em 1 hora." }
```

> Rate limit: **1 requisição por IP a cada hora**, persistido no MongoDB (coleção `rateLimits`).

---

### `GET /health`

Verifica se a Lambda está em execução.

**Resposta 200:**
```json
{ "status": "ok" }
```

---

## Variáveis de ambiente

| Variável       | Obrigatória | Descrição                                                        |
|----------------|-------------|------------------------------------------------------------------|
| `MONGODB_URI`  | Sim         | URI de conexão MongoDB Atlas (com usuário/senha URL-encoded)     |
| `CORS_ORIGIN`  | Não         | Origem permitida pelo CORS. Padrão: `https://interlude.studio`   |
| `PORT`         | Não         | Porta para servidor local. Padrão: aleatória                     |

Copie `.env.example` para `.env` e preencha os valores:

```bash
cp .env.example .env
```

---

## Pré-requisitos

- Node.js 22.x
- npm
- [Serverless Framework](https://www.serverless.com/) (`npm i -g serverless`)
- Conta AWS com credenciais configuradas (`aws configure`)
- Cluster MongoDB Atlas acessível pela Lambda (libere `0.0.0.0/0` no Network Access ou use VPC Peering)

---

## Instalação

```bash
npm install
```

---

## Desenvolvimento local

```bash
npm run dev
```

Inicia o servidor Express em modo watch via `nodemon` + `ts-node`. A porta é lida de `PORT` no `.env` (padrão: aleatória).

---

## Testes

```bash
npm test          # executa uma vez
npm run test:watch  # modo watch
```

Os testes ficam em `tests/` e usam Jest + ts-jest. O gateway do MongoDB é mockado — nenhuma conexão real é necessária para rodar os testes.

---

## Build

```bash
npm run build
```

Compila os arquivos TypeScript para `build/` usando esbuild (configurado em [esbuild.config.js](esbuild.config.js)).

---

## Deploy

**Staging (dev):**
```bash
npm run deploy:dev
```

**Produção:**
```bash
npm run deploy:prod
# ou simplesmente:
npm run deploy
```

Ambos executam `npm run build` antes do deploy. O stage e a região são passados automaticamente (`--stage dev|prod --region us-east-1`).

Após o deploy, a URL de submissão de e-mails é exibida nos outputs do Serverless:
```
emailSubmeter: https://interlude-studio-back.execute-api.us-east-1.amazonaws.com/<stage>/email/submeter
```

---

## Segurança

- **Helmet** — headers HTTP de segurança
- **CORS** — restrito à origem configurada em `CORS_ORIGIN`
- **express-mongo-sanitize** — previne injeção de operadores MongoDB
- **sanitizarEntrada** — remove tags HTML do body (anti-XSS)
- **Zod** — validação e tipagem do corpo da requisição
- **Limite de payload** — `10kb` máximo no body JSON
- **Rate limiter** — 1 req/hora por IP em `POST /email/submeter`, store persistido no MongoDB via `rate-limit-mongo`

---

## Stack

| Camada        | Tecnologia                                   |
|---------------|----------------------------------------------|
| Runtime       | Node.js 22.x (AWS Lambda)                    |
| Linguagem     | TypeScript 5                                 |
| Framework HTTP| Express 4                                    |
| Banco de dados| MongoDB Atlas (via Mongoose 8)               |
| Deploy        | Serverless Framework 4 + serverless-esbuild  |
| Validação     | Zod                                          |
| Logger        | Pino                                         |
| Testes        | Jest + ts-jest                               |
