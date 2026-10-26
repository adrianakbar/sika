import { getLocalPrisma, serializePrisma, deserializePrisma } from '@/lib/prisma';

const RPC_KEY = process.env.SIKA_RPC_KEY || 'sika-homeserver-rpc-2026-992';
const ALLOWED_MODELS = new Set(['user', 'goal', 'permitPlanning', 'organizationStructure']);
const ALLOWED_OPS = new Set([
  'findMany',
  'findUnique',
  'findFirst',
  'create',
  'update',
  'delete',
  'deleteMany',
  'count',
  'upsert',
]);

export async function POST(request) {
  if (request.headers.get('x-sika-rpc-key') !== RPC_KEY) {
    return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const raw = await request.text();
    const { model, operation, args } = deserializePrisma(raw);

    if (!ALLOWED_MODELS.has(model) || !ALLOWED_OPS.has(operation)) {
      return new Response(JSON.stringify({ ok: false, error: 'Forbidden operation' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = getLocalPrisma();
    const data = args === undefined ? await db[model][operation]() : await db[model][operation](args);

    return new Response(serializePrisma({ ok: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
