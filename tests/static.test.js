const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('published HTML references existing local assets in dependency order', () => {
  const html = read('frontend/public/index.html');
  const sources = [...html.matchAll(/<script src="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(sources, ['config.js', 'meta.js', 'supabase-api.js', 'app.js']);
  for (const source of sources) assert.ok(fs.existsSync(path.join(root, 'frontend/public', source)), `${source} is missing`);
});

test('every position has a skill definition and universal skills exist', () => {
  const context = { window: {} };
  vm.runInNewContext(read('frontend/public/meta.js'), context);
  const meta = context.window.FOOTBALL_META;
  assert.ok(meta.positions.length >= 19);
  assert.ok(meta.universalSkills.length >= 10);
  for (const position of meta.positions) {
    assert.ok(meta.skillsByPosition[position.code]?.length > 0, `${position.code} has no skill definition`);
  }
});

test('static app contains no Supabase secret key and SQL enables RLS', () => {
  const publicFiles = ['config.js', 'supabase-api.js', 'app.js'].map(file => read(`frontend/public/${file}`)).join('\n');
  assert.doesNotMatch(publicFiles, /service_role|sb_secret_/i);
  const sql = read('supabase/setup.sql');
  for (const table of ['team_members', 'players', 'drafts']) {
    assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`, 'i'));
  }
  assert.match(sql, /revoke all on table[\s\S]+from anon, authenticated/i);
});

test('all static getElementById references exist in HTML', () => {
  const html = read('frontend/public/index.html');
  const app = read('frontend/public/app.js');
  const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map(match => match[1]));
  const references = [...app.matchAll(/getElementById\('([^']+)'\)/g)].map(match => match[1]);
  const missing = references.filter(id => !ids.has(id) && !/^(badge|ne|slider)-/.test(id));
  assert.deepEqual(missing, []);
});

test('Supabase adapter authenticates and scopes data requests through bearer auth', async () => {
  const storage = new Map();
  const calls = [];
  const context = {
    window: {
      APP_CONFIG: {
        supabaseUrl: 'https://project.supabase.co',
        supabasePublishableKey: 'sb_publishable_test',
      },
      FOOTBALL_META: { positions: [], skillsByPosition: {}, universalSkills: [] },
    },
    localStorage: {
      getItem: key => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: key => storage.delete(key),
    },
    crypto: { randomUUID: () => '00000000-0000-4000-8000-000000000001' },
    fetch: async (url, options = {}) => {
      calls.push({ url, options });
      if (url.includes('/auth/v1/token')) {
        return new Response(JSON.stringify({
          access_token: 'user-token', refresh_token: 'refresh-token', expires_in: 3600,
          user: { id: '00000000-0000-4000-8000-000000000002', email: 'coach@example.com' },
        }), { status: 200 });
      }
      if (url.includes('/team_members?')) {
        return new Response(JSON.stringify([{ team_id: 'team-id', team_name: 'Rams', display_name: 'Coach' }]), { status: 200 });
      }
      if (url.endsWith('/players?select=id,data,updated_at&order=updated_at.desc')) {
        return new Response(JSON.stringify([{ id: 'player-id', data: { profile: { firstName: 'Ada' } }, updated_at: '2026-01-01' }]), { status: 200 });
      }
      return new Response(null, { status: 204 });
    },
    Response,
    URL,
    console,
    setTimeout,
    clearTimeout,
  };
  vm.runInNewContext(read('frontend/public/supabase-api.js'), context);
  await context.window.supabaseApi.signIn('coach@example.com', 'password');
  const profile = await context.window.supabaseApi.getCoachProfile();
  const players = await context.window.supabaseApi.apiFetch('GET', '/players');

  assert.equal(profile.team, 'Rams');
  assert.equal(players[0].profile.firstName, 'Ada');
  const dataCall = calls.find(call => call.url.includes('/rest/v1/players'));
  assert.equal(dataCall.options.headers.apikey, 'sb_publishable_test');
  assert.equal(dataCall.options.headers.Authorization, 'Bearer user-token');
});
