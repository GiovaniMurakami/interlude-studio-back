import rateLimit from "express-rate-limit";
import MongoStore from "rate-limit-mongo";

export const rateLimiterEmail = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 1,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip ?? "unknown",
  store: new MongoStore({
    uri: process.env.MONGODB_URI!,
    collectionName: "rateLimits",
    expireTimeMs: 60 * 60 * 1000,
  }),
  handler: (_req, res) => {
    res.status(429).json({
      mensagem: "Muitas tentativas. Tente novamente em 1 hora.",
    });
  },
});
