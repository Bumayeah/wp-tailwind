/**
 * In-memory mock adapter for GitHub Pages / local preview without a WP backend.
 * Bundled via Vite's static JSON import — no server required.
 *
 * Data resets on page reload (same as json-server behaviour).
 */
import dbOriginal from '../../../mock-api/db.json'

type Db = typeof dbOriginal
const db: Db = JSON.parse(JSON.stringify(dbOriginal))

function getUserId(): number | null {
  const token = localStorage.getItem('swg-token')
  if (!token) return null
  return db.auth_tokens.find((r) => r.token === token)?.user.id ?? null
}

function parsePath(path: string): { base: string; id?: number } {
  const m = path.match(/^(.*?)\/(\d+)$/)
  return m ? { base: m[1]!, id: Number(m[2]) } : { base: path }
}

export function mockGet<T>(path: string, params?: Record<string, string>): T {
  const { base, id } = parsePath(path)

  switch (base) {
    case '/wp/v2/posts':
      if (params?.slug) return db.posts.filter((p) => p.slug === params.slug) as T
      return db.posts as T

    case '/wp/v2/pages':
      if (params?.slug) return db.pages.filter((p) => p.slug === params.slug) as T
      return db.pages as T

    case '/swg/v1/agenda':
      if (id !== undefined) return (db.agenda.find((a) => a.id === id) ?? null) as T
      if (params?.slug) return db.agenda.filter((a) => a.slug === params.slug) as T
      return db.agenda as T

    case '/swg/v1/bestuur':
      return db.board as T

    case '/swg/v1/sponsors':
      return db.sponsors as T

    case '/swg/v1/testimonials':
      return db.testimonials as T

    case '/acf/v3/options/options':
      // json-server routes /site_options/1 → returns single object, not array
      return (db.site_options[0] ?? null) as T

    case '/jwt-auth/v1/token':
      if (params?.email) return db.auth_tokens.filter((r) => r.email === params.email) as T
      return db.auth_tokens as T

    case '/swg/v1/mijn/inschrijvingen': {
      const uid = getUserId()
      return db.mijn_inschrijvingen.filter((r) => r.user_id === uid) as T
    }

    case '/swg/v1/mijn/vragen': {
      const uid = getUserId()
      return db.mijn_vragen.filter((q) => q.user_id === uid) as T
    }

    case '/swg/v1/mijn/profiel': {
      const uid = getUserId()
      return db.mijn_profiel.filter((p) => p.user_id === uid) as T
    }

    default:
      return [] as T
  }
}

export function mockPost<T>(path: string, body: unknown): T {
  const data = body as Record<string, unknown>

  switch (path) {
    case '/swg/v1/mijn/inschrijvingen': {
      const item = { id: Date.now(), ...data }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      db.mijn_inschrijvingen.push(item as any)
      return item as T
    }

    case '/swg/v1/mijn/vragen': {
      const uid = getUserId()
      const item = {
        id: Date.now(),
        user_id: uid,
        status: 'pending',
        created_at: new Date().toISOString(),
        ...data,
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      db.mijn_vragen.push(item as any)
      return item as T
    }

    // Fire-and-forget mock endpoints — just acknowledge
    case '/swg/v1/account/register':
    case '/swg/v1/account/reset-password':
      return {} as T

    default:
      return {} as T
  }
}

export function mockPatch<T>(path: string, body: unknown): T {
  const { base, id } = parsePath(path)
  const data = body as Record<string, unknown>

  switch (base) {
    case '/swg/v1/agenda': {
      const item = db.agenda.find((a) => a.id === id)
      if (item) Object.assign(item, data)
      return (item ?? {}) as T
    }

    case '/swg/v1/mijn/inschrijvingen': {
      const item = db.mijn_inschrijvingen.find((r) => r.id === id)
      if (item) Object.assign(item, data)
      return (item ?? {}) as T
    }

    case '/swg/v1/mijn/profiel': {
      const item = db.mijn_profiel.find((p) => p.id === id)
      if (item) Object.assign(item, data)
      return (item ?? {}) as T
    }

    default:
      return {} as T
  }
}

export function mockDelete(path: string): void {
  const { base, id } = parsePath(path)

  switch (base) {
    case '/swg/v1/mijn/vragen': {
      const idx = db.mijn_vragen.findIndex((q) => q.id === id)
      if (idx !== -1) db.mijn_vragen.splice(idx, 1)
      break
    }
    case '/swg/v1/mijn/inschrijvingen': {
      const idx = db.mijn_inschrijvingen.findIndex((r) => r.id === id)
      if (idx !== -1) db.mijn_inschrijvingen.splice(idx, 1)
      break
    }
  }
}
