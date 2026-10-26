import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

// ponytail: HTTP RPC bridge over Cloudflare Tunnel avoids paid Spectrum TCP; upgrade to direct MySQL TLS if dedicated public IPv4 is added.
const RPC_URL = process.env.HOMESERVER_PRISMA_RPC_URL || 'https://sika.adrianakbar.my.id/api/prisma-rpc';
const RPC_KEY = process.env.SIKA_RPC_KEY || 'sika-homeserver-rpc-2026-992';

export const serializePrisma = (obj) =>
  JSON.stringify(obj, function (k, v) {
    return this[k] instanceof Date ? { __sika_date: this[k].toISOString() } : v;
  });

export const deserializePrisma = (str) =>
  JSON.parse(str, (k, v) =>
    v && typeof v === 'object' && v.__sika_date ? new Date(v.__sika_date) : v
  );

export function getLocalPrisma() {
  if (!globalForPrisma.__localPrisma) {
    globalForPrisma.__localPrisma = new PrismaClient();
  }
  return globalForPrisma.__localPrisma;
}

function createRemotePrisma() {
  return new Proxy(
    {
      $connect: async () => {},
      $disconnect: async () => {},
    },
    {
      get(target, model) {
        if (model in target || typeof model === 'symbol') return target[model];
        return new Proxy(
          {},
          {
            get(_, operation) {
              return async (args) => {
                const res = await fetch(RPC_URL, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-sika-rpc-key': RPC_KEY,
                  },
                  body: serializePrisma({ model, operation, args }),
                  cache: 'no-store',
                });
                const text = await res.text();
                const payload = deserializePrisma(text);
                if (!res.ok || !payload?.ok) {
                  throw new Error(payload?.error || `Prisma RPC error (${res.status})`);
                }
                return payload.data;
              };
            },
          }
        );
      },
    }
  );
}

export const prisma =
  process.env.USE_LOCAL_PRISMA === 'true' ? getLocalPrisma() : createRemotePrisma();

export default prisma;
