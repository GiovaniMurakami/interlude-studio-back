import { Request, Response, NextFunction } from "express";

function sanitizarString(valor: unknown): unknown {
  if (typeof valor === "string") {
    return valor.replace(/<[^>]*>/g, "").trim();
  }
  if (typeof valor === "object" && valor !== null) {
    return sanitizarObjeto(valor as Record<string, unknown>);
  }
  return valor;
}

function sanitizarObjeto(obj: Record<string, unknown>): Record<string, unknown> {
  const resultado: Record<string, unknown> = {};
  for (const chave in obj) {
    resultado[chave] = sanitizarString(obj[chave]);
  }
  return resultado;
}

export function sanitizarEntrada(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizarObjeto(req.body as Record<string, unknown>);
  }
  next();
}
