// src/lib/GoogleApiService.ts
const BASE = {
  calendar: 'https://www.googleapis.com/calendar/v3',
  gmail: 'https://gmail.googleapis.com/gmail/v1/users/me',
  drive: 'https://www.googleapis.com/drive/v3',
  docs: 'https://docs.googleapis.com/v1',
  meet: 'https://meet.googleapis.com/v2',
  maps: 'https://maps.googleapis.com/maps/api',
};

const g = (token: string) => ({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' });

// ── CALENDAR ──────────────────────────────────────────────
export const createCalendarEvent = async (token: string, event: {
  summary: string; description?: string; start: string; end: string; location?: string;
}) => {
  return fetch(`${BASE.calendar}/calendars/primary/events`, {
    method: 'POST', headers: g(token),
    body: JSON.stringify({
      summary: event.summary,
      description: event.description,
      location: event.location,
      start: { dateTime: event.start, timeZone: 'America/New_York' },
      end: { dateTime: event.end, timeZone: 'America/New_York' },
    })
  }).then(r => r.json());
};

export const getUpcomingEvents = async (token: string, maxResults = 5) =>
  fetch(`${BASE.calendar}/calendars/primary/events?maxResults=${maxResults}&orderBy=startTime&singleEvents=true&timeMin=${new Date().toISOString()}`, 
    { headers: g(token) }).then(r => r.json());

// ── GMAIL ─────────────────────────────────────────────────
export const sendEmail = async (token: string, to: string, subject: string, body: string) => {
  const message = btoa(`To: ${to}\r\nSubject: ${subject}\r\nContent-Type: text/html\r\n\r\n${body}`).replace(/\+/g,'-').replace(/\//g,'_');
  return fetch(`${BASE.gmail}/messages/send`, {
    method: 'POST', headers: g(token),
    body: JSON.stringify({ raw: message })
  }).then(r => r.json());
};

export const draftEmail = async (token: string, to: string, subject: string, body: string) => {
  const message = btoa(`To: ${to}\r\nSubject: ${subject}\r\nContent-Type: text/html\r\n\r\n${body}`).replace(/\+/g,'-').replace(/\//g,'_');
  return fetch(`${BASE.gmail}/drafts`, {
    method: 'POST', headers: g(token),
    body: JSON.stringify({ message: { raw: message } })
  }).then(r => r.json());
};

// ── DRIVE / DOCS ──────────────────────────────────────────
export const createDoc = async (token: string, title: string) =>
  fetch(`${BASE.docs}/documents`, {
    method: 'POST', headers: g(token),
    body: JSON.stringify({ title })
  }).then(r => r.json());

export const listDriveFiles = async (token: string, query = '') =>
  fetch(`${BASE.drive}/files?q=${encodeURIComponent(query)}&fields=files(id,name,webViewLink,modifiedTime)`,
    { headers: g(token) }).then(r => r.json());

// ── MEET ──────────────────────────────────────────────────
export const createMeetSpace = async (token: string) =>
  fetch(`${BASE.meet}/spaces`, {
    method: 'POST', headers: g(token), body: '{}'
  }).then(r => r.json());
