import { type Request } from "express";
import { ipKeyGenerator, rateLimit } from "express-rate-limit";

const windowMs = 15 * 60 * 1000;

// The Worker overwrites x-client-ip with cf-connecting-ip; the origin only accepts Cloudflare IPs
const keyGenerator = (req: Request) => {
  const clientIp = req.get("x-client-ip");

  return ipKeyGenerator(clientIp ? clientIp : (req.ip ?? ""));
};

const limiter = (envName: string, defaultLimit: number) =>
  rateLimit({
    windowMs,
    limit: () => Number(process.env[envName] ?? defaultLimit),
    keyGenerator,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message: "Too many requests, try again later" },
  });

export const writeLimiter = limiter("WRITE_RATE_LIMIT", 30);
export const resetLimiter = limiter("RESET_RATE_LIMIT", 10);
