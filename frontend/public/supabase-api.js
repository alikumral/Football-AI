(function () {
  'use strict';

  const SESSION_KEY = 'football_ai_supabase_session';
  let session = null;

  function configuration() {
    const config = window.APP_CONFIG || {};
    const url = String(config.supabaseUrl || '').replace(/\/$/, '');
    const key = String(config.supabasePublishableKey || '');
    if (!url.startsWith('https://') || url.includes('YOUR_PROJECT_REF') || !key || key.includes('YOUR_SUPABASE')) {
      throw new Error('Supabase is not configured yet. Complete frontend/public/config.js first.');
    }
    return { url, key };
  }

  function readStoredSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
    catch { return null; }
  }

  function storeSession(payload) {
    session = {
      ...payload,
      expires_at: payload.expires_at || Math.floor(Date.now() / 1000) + Number(payload.expires_in || 3600),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  function clearSession() {
    session = null;
    localStorage.removeItem(SESSION_KEY);
  }

  async function parseResponse(response) {
    const text = await response.text();
    const payload = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;
    if (!response.ok) {
      const message = payload?.msg || payload?.message || payload?.error_description || payload?.error || `Request failed (${response.status})`;
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }
    return payload;
  }

  async function authRequest(path, body, token) {
    const { url, key } = configuration();
    const response = await fetch(`${url}/auth/v1${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return parseResponse(response);
  }

  async function signIn(email, password) {
    const payload = await authRequest('/token?grant_type=password', { email, password });
    return storeSession(payload);
  }

  async function refreshSession() {
    const current = session || readStoredSession();
    if (!current?.refresh_token) { clearSession(); return null; }
    try {
      return storeSession(await authRequest('/token?grant_type=refresh_token', { refresh_token: current.refresh_token }));
    } catch (error) {
      clearSession();
      throw error;
    }
  }

  async function getSession() {
    configuration();
    session = session || readStoredSession();
    if (!session) return null;
    if (Number(session.expires_at || 0) <= Math.floor(Date.now() / 1000) + 60) return refreshSession();
    return session;
  }

  async function signOut() {
    const current = session || readStoredSession();
    try {
      if (current?.access_token) await authRequest('/logout', null, current.access_token);
    } finally {
      clearSession();
    }
  }

  async function restRequest(method, path, body, prefer, retry = true) {
    const current = await getSession();
    if (!current?.access_token) throw new Error('Your session has expired. Please sign in again.');
    const { url, key } = configuration();
    const response = await fetch(`${url}/rest/v1${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${current.access_token}`,
        ...(prefer ? { Prefer: prefer } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (response.status === 401 && retry) {
      await refreshSession();
      return restRequest(method, path, body, prefer, false);
    }
    return parseResponse(response);
  }

  async function getCoachProfile() {
    const current = await getSession();
    if (!current?.user?.id) return null;
    const rows = await restRequest(
      'GET',
      `/team_members?select=team_id,team_name,display_name&user_id=eq.${encodeURIComponent(current.user.id)}&limit=1`
    );
    if (!rows?.length) throw new Error('This account has not been assigned to a team.');
    return { name: rows[0].display_name || current.user.email, team: rows[0].team_name, email: current.user.email };
  }

  function unpack(rows) {
    return (rows || []).map(row => ({ ...row.data, id: row.id, updatedAt: row.updated_at }));
  }

  async function listRecords(table) {
    return unpack(await restRequest('GET', `/${table}?select=id,data,updated_at&order=updated_at.desc`));
  }

  async function getRecord(table, id) {
    const rows = await restRequest('GET', `/${table}?select=id,data,updated_at&id=eq.${encodeURIComponent(id)}&limit=1`);
    if (!rows?.length) throw new Error(`${table === 'players' ? 'Player' : 'Draft'} not found`);
    return unpack(rows)[0];
  }

  async function saveDraft(id, data) {
    const rows = await restRequest(
      'POST',
      '/drafts?on_conflict=id',
      { id, data: { ...data, id } },
      'resolution=merge-duplicates,return=representation'
    );
    return unpack(rows)[0];
  }

  async function submitPlayer(data) {
    await restRequest('POST', '/rpc/submit_player', { p_player_id: data.id, p_player_data: data });
    return data;
  }

  async function deleteRecord(table, id) {
    await restRequest('DELETE', `/${table}?id=eq.${encodeURIComponent(id)}`);
    return { success: true };
  }

  async function apiFetch(method, path, body) {
    if (method === 'GET' && path === '/meta') return window.FOOTBALL_META;
    if (method === 'GET' && path === '/players') return listRecords('players');
    if (method === 'GET' && path === '/drafts') return listRecords('drafts');
    if (method === 'POST' && path === '/drafts/new') return { id: crypto.randomUUID() };
    if (method === 'POST' && path === '/players') return submitPlayer(body);

    let match = path.match(/^\/(players|drafts)\/([0-9a-f-]+)$/i);
    if (!match) throw new Error(`Unsupported data operation: ${method} ${path}`);
    const [, table, id] = match;
    if (method === 'GET') return getRecord(table, id);
    if (method === 'DELETE') return deleteRecord(table, id);
    if (method === 'PUT' && table === 'drafts') return saveDraft(id, body);
    throw new Error(`Unsupported data operation: ${method} ${path}`);
  }

  window.supabaseApi = { apiFetch, configuration, getCoachProfile, getSession, signIn, signOut };
})();
