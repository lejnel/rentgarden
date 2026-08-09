// src/pages/api/prices/[id].ts — DELETE a specific price
import type { APIRoute } from 'astro';

export const prerender = false;

export const DELETE: APIRoute = async ({ params, locals }) => {
  const id = parseInt(params.id || '');
  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const db = (locals as any).runtime?.env?.DB;
    if (db) {
      await db.prepare('DELETE FROM prices WHERE id = ?').bind(id).run();
    }
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
