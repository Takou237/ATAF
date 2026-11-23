import {
  agencies as rawAgencies,
  events as rawEvents,
  members as rawMembers,
  news as rawNews,
  regulations as rawRegulations,
} from '../data';

const defaultApiUrl = (): string => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return `http://${host}:8000/api`;
    }
  }

  return 'http://localhost:8000/api';
};

const API_URL: string = (import.meta.env.VITE_API_URL as string | undefined) ?? defaultApiUrl();

const TOKEN_KEY = 'ataf_token';

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage unavailable
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getToken();
  if (options.auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError(0, "Impossible de joindre le serveur ATAF. Vérifiez que l'API est démarrée.");
  }

  if (!response.ok) {
    let message = `Erreur ${response.status}`;
    let errors: Record<string, string[]> | undefined;

    try {
      const payload = await response.json();
      message = payload?.message ?? message;
      errors = payload?.errors;
    } catch {
      // ignore invalid JSON
    }

    throw new ApiError(response.status, message, errors);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

/* ------------------------------------------------------------------ */
/* Types exposed to the UI (same shape as the previous static data)    */
/* ------------------------------------------------------------------ */

export type NewsItem = {
  id: number;
  title: string;
  date: string;
  category: string;
  summary: string;
  image: string;
  body?: string;
  isMembersOnly?: boolean;
};

export type EventItem = {
  id: number;
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  status: string;
  description: string;
  maxParticipants: number;
  registered: number;
};

export type EventProgramItem = { time: string; title: string };

export type MemberItem = {
  id: number;
  name: string;
  country: string;
  city: string;
  category: string;
  since: number;
  logo: string;
  web: string;
  email: string;
  phone: string;
};

export type AgencyItem = {
  id: number;
  name: string;
  code: string;
  country: string;
  city: string;
  status: string;
};

export type RegulationItem = {
  id: number;
  title: string;
  date: string;
  category: string;
  type: string;
  summary: string;
};

export type PublicationItem = {
  id: number;
  title: string;
  type: string;
  date: string;
  pages: number;
};

export type DocumentItem = {
  id: number;
  code: string;
  title: string;
  org: string;
  date: string;
  downloadUrl: string | null;
};

export type ListParams = {
  search?: string;
  page?: number;
  perPage?: number;
  category?: string;
  country?: string;
  type?: string;
  status?: string;
  upcoming?: boolean;
  membersOnly?: boolean;
};

export type Paginated<T> = {
  data: T[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

type ApiPaginator<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  organisation?: string | null;
  phone?: string | null;
  status?: string;
  roles: string[];
  profile?: {
    role?: string | null;
    phone?: string | null;
    member?: { id: number; name: string; joined_year?: number | null } | null;
  } | null;
};

type ApiNews = {
  id: number;
  title: string;
  excerpt?: string | null;
  body?: string | null;
  image_path?: string | null;
  published_at?: string | null;
  is_members_only?: boolean;
  category?: { name: string } | null;
};

type ApiEvent = {
  id: number;
  slug: string;
  title: string;
  description?: string | null;
  type?: string | null;
  status?: string | null;
  starts_at?: string | null;
  time?: string | null;
  location?: string | null;
  capacity?: number | null;
  image_path?: string | null;
  registrations_count?: number;
  programs?: { time: string; title: string }[];
};

type ApiMember = {
  id: number;
  name: string;
  city?: string | null;
  category?: string | null;
  joined_year?: number | null;
  logo_path?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  country?: { name: string } | null;
};

type ApiAgency = {
  id: number;
  name: string;
  agreement_number: string;
  country?: string | null;
  city?: string | null;
  status?: string | null;
};

type ApiRegulation = {
  id: number;
  title: string;
  published_on?: string | null;
  category?: string | null;
  type?: string | null;
  summary?: string | null;
};

type ApiPublication = {
  id: number;
  title: string;
  type?: string | null;
  published_on?: string | null;
  pages?: number | null;
};

type ApiDocument = {
  id: number;
  slug: string;
  title: string;
  category?: string | null;
  type?: string | null;
  published_on?: string | null;
  file_path?: string | null;
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=500&fit=crop';

const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

const mediaUrl = (value?: string | null): string => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value) || value.startsWith('/')) return value;
  return `${API_ORIGIN}/storage/${value.replace(/^\/+/, '')}`;
};

const dateOnly = (value?: string | null): string => (value ? String(value).slice(0, 10) : '');
const stripProtocol = (value?: string | null): string => String(value ?? '').replace(/^https?:\/\//, '');

/**
 * L'API peut renvoyer `null` sur des champs facultatifs. On normalise tout en
 * chaîne pour que les `.toLowerCase()`, `.includes()`, `.charAt()` des pages ne
 * puissent jamais lever d'exception (qui rendrait la page entièrement blanche).
 */
const str = (value: unknown): string => (value === null || value === undefined ? '' : String(value));

function toQuery(params: ListParams = {}): string {
  const query = new URLSearchParams();

  if (params.search) query.set('search', params.search);
  if (params.page) query.set('page', String(params.page));
  if (params.perPage) query.set('per_page', String(params.perPage));
  if (params.category) query.set('category', params.category);
  if (params.country) query.set('country', params.country);
  if (params.type) query.set('type', params.type);
  if (params.status) query.set('status', params.status);
  if (params.upcoming) query.set('upcoming', '1');
  if (params.membersOnly) query.set('members_only', '1');

  const value = query.toString();
  return value ? `?${value}` : '';
}

function paginateLocally<T>(items: T[], params: ListParams, perPage: number): Paginated<T> {
  const page = Math.max(1, params.page ?? 1);
  const start = (page - 1) * perPage;

  return {
    data: items.slice(start, start + perPage),
    currentPage: page,
    lastPage: Math.max(1, Math.ceil(items.length / perPage)),
    perPage,
    total: items.length,
  };
}

/* ------------------------------------------------------------------ */
/* Mappers                                                             */
/* ------------------------------------------------------------------ */

export const mapNews = (item: ApiNews): NewsItem => ({
  id: item.id,
  title: str(item.title),
  date: dateOnly(item.published_at),
  category: str(item.category?.name) || 'Actualité',
  summary: str(item.excerpt),
  image: mediaUrl(item.image_path) || FALLBACK_IMAGE,
  body: item.body ?? undefined,
  isMembersOnly: item.is_members_only ?? false,
});

export const mapEvent = (item: ApiEvent): EventItem => ({
  id: item.id,
  slug: str(item.slug) || String(item.id),
  title: str(item.title),
  date: dateOnly(item.starts_at),
  time: str(item.time) || (item.starts_at ? new Date(item.starts_at).toTimeString().slice(0, 5) : ''),
  location: str(item.location),
  type: str(item.type) || 'Événement',
  status: str(item.status) || 'Ouvert',
  description: str(item.description),
  maxParticipants: item.capacity ?? 0,
  registered: item.registrations_count ?? 0,
});

export const mapMember = (item: ApiMember): MemberItem => ({
  id: item.id,
  name: str(item.name),
  country: str(item.country?.name),
  city: str(item.city),
  category: str(item.category),
  since: item.joined_year ?? 0,
  logo: mediaUrl(item.logo_path),
  web: stripProtocol(item.website),
  email: str(item.email),
  phone: str(item.phone),
});

export const mapAgency = (item: ApiAgency): AgencyItem => ({
  id: item.id,
  name: str(item.name),
  code: str(item.agreement_number),
  country: str(item.country),
  city: str(item.city),
  status: str(item.status),
});

export const mapRegulation = (item: ApiRegulation): RegulationItem => ({
  id: item.id,
  title: str(item.title),
  date: dateOnly(item.published_on),
  category: str(item.category),
  type: str(item.type),
  summary: str(item.summary),
});

export const mapPublication = (item: ApiPublication): PublicationItem => ({
  id: item.id,
  title: str(item.title),
  type: str(item.type),
  date: dateOnly(item.published_on),
  pages: item.pages ?? 0,
});

/* ------------------------------------------------------------------ */
/* Public content                                                      */
/* ------------------------------------------------------------------ */

async function withFallback<T>(loader: () => Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await loader();
  } catch (error) {
    console.warn(`[ATAF API] ${label} indisponible, données de démonstration utilisées.`, error);
    return fallback;
  }
}

export function getNews(params: ListParams = {}): Promise<NewsItem[]> {
  return withFallback(
    async () => (await request<ApiNews[]>(`/news${toQuery(params)}`)).map(mapNews),
    staticNews,
    'actualités',
  );
}

export async function getNewsPage(params: ListParams = {}): Promise<Paginated<NewsItem>> {
  const perPage = params.perPage ?? 9;

  try {
    const payload = await request<ApiPaginator<ApiNews>>(
      `/news${toQuery({ ...params, perPage, page: params.page ?? 1 })}`,
    );

    return {
      data: payload.data.map(mapNews),
      currentPage: payload.current_page,
      lastPage: payload.last_page,
      perPage: payload.per_page,
      total: payload.total,
    };
  } catch (error) {
    console.warn('[ATAF API] actualités indisponibles, données de démonstration utilisées.', error);
    const filtered = staticNews.filter((item) =>
      (!params.search || item.title.toLowerCase().includes(params.search.toLowerCase())) &&
      (!params.category || item.category === params.category) &&
      (!params.membersOnly || item.isMembersOnly),
    );
    return paginateLocally(filtered, params, perPage);
  }
}

export function getEvents(params: ListParams = {}): Promise<EventItem[]> {
  return withFallback(
    async () => (await request<ApiEvent[]>(`/events${toQuery(params)}`)).map(mapEvent),
    staticEvents,
    'événements',
  );
}

export async function getEvent(slug: string): Promise<EventItem & { programs: EventProgramItem[] }> {
  const item = await request<ApiEvent>(`/events/${slug}`);
  return {
    ...mapEvent(item),
    programs: (item.programs ?? []).map((program) => ({ time: str(program.time), title: str(program.title) })),
  };
}

export function getMembers(params: ListParams = {}): Promise<MemberItem[]> {
  return withFallback(
    async () => (await request<ApiMember[]>(`/members${toQuery(params)}`)).map(mapMember),
    staticMembers,
    'membres',
  );
}

export function getAgencies(params: ListParams = {}): Promise<AgencyItem[]> {
  return withFallback(
    async () => (await request<ApiAgency[]>(`/agencies${toQuery(params)}`)).map(mapAgency),
    staticAgencies,
    'agences',
  );
}

export function getRegulations(params: ListParams = {}): Promise<RegulationItem[]> {
  return withFallback(
    async () => (await request<ApiRegulation[]>(`/regulations${toQuery(params)}`)).map(mapRegulation),
    staticRegulations,
    'réglementations',
  );
}

export function getPublications(params: ListParams = {}): Promise<PublicationItem[]> {
  return withFallback(
    async () => (await request<ApiPublication[]>(`/publications${toQuery(params)}`)).map(mapPublication),
    staticPublications,
    'publications',
  );
}

const mapDocument = (item: ApiDocument): DocumentItem => ({
  id: item.id,
  code: str(item.category) || str(item.type) || 'Document',
  title: str(item.title),
  org: str(item.type) || 'ATAF',
  date: dateOnly(item.published_on),
  downloadUrl: item.file_path
    ? `${API_URL}/documents/${encodeURIComponent(item.slug)}/download`
    : null,
});

export function getDocuments(params: ListParams = {}): Promise<DocumentItem[]> {
  return withFallback(
    async () => (await request<ApiDocument[]>(`/documents${toQuery(params)}`)).map(mapDocument),
    staticDocuments,
    'textes réglementaires',
  );
}

export async function getDocumentsPage(params: ListParams = {}): Promise<Paginated<DocumentItem>> {
  const perPage = params.perPage ?? 10;

  try {
    const payload = await request<ApiPaginator<ApiDocument>>(
      `/documents${toQuery({ ...params, perPage, page: params.page ?? 1 })}`,
    );

    return {
      data: payload.data.map(mapDocument),
      currentPage: payload.current_page,
      lastPage: payload.last_page,
      perPage: payload.per_page,
      total: payload.total,
    };
  } catch (error) {
    console.warn('[ATAF API] documents indisponibles, données de démonstration utilisées.', error);
    const filtered = staticDocuments.filter((item) =>
      (!params.search || item.title.toLowerCase().includes(params.search.toLowerCase())) &&
      (!params.category || item.code === params.category),
    );
    return paginateLocally(filtered, params, perPage);
  }
}

export async function verifyAgency(code: string): Promise<{ found: boolean; agency: AgencyItem | null }> {
  const data = await request<{ found: boolean; agency: ApiAgency | null }>(
    `/agencies/verify/${encodeURIComponent(code.trim())}`,
  );

  return {
    found: data.found,
    agency: data.agency ? mapAgency(data.agency) : null,
  };
}

/* ------------------------------------------------------------------ */
/* Public forms                                                        */
/* ------------------------------------------------------------------ */

export type ContactPayload = {
  name: string;
  email: string;
  organisation?: string;
  subject: string;
  message: string;
  website?: string;
};

export function submitContact(payload: ContactPayload): Promise<{ message: string }> {
  return request('/contact-messages', { method: 'POST', body: payload });
}

export function subscribeNewsletter(
  email: string,
  name?: string,
  website?: string,
): Promise<{ message: string; token: string }> {
  return request('/newsletter/subscribe', { method: 'POST', body: { email, name, website } });
}

export type EventRegistrationPayload = {
  firstName: string;
  lastName: string;
  email: string;
  function?: string;
  company?: string;
  country?: string;
  phone?: string;
  participationType?: string;
  specialNeeds?: string;
  website?: string;
};

export function registerToEvent(slug: string, payload: EventRegistrationPayload): Promise<{ message: string }> {
  return request(`/events/${slug}/registrations`, {
    method: 'POST',
    body: {
      first_name: payload.firstName,
      last_name: payload.lastName,
      email: payload.email,
      function: payload.function,
      company: payload.company,
      country: payload.country,
      phone: payload.phone,
      participation_type: payload.participationType,
      special_needs: payload.specialNeeds,
      website: payload.website,
    },
  });
}

export type MembershipPayload = {
  name: string;
  organisation: string;
  country: string;
  email: string;
  phone?: string;
  category?: string;
  message?: string;
  website?: string;
};

export function submitMembershipApplication(payload: MembershipPayload): Promise<{ message: string }> {
  return request('/membership-applications', { method: 'POST', body: payload });
}

export type AgencyApplicationPayload = {
  firstName: string;
  lastName: string;
  agencyName: string;
  country: string;
  email: string;
  phone?: string;
  message?: string;
  website?: string;
};

export function submitAgencyApplication(payload: AgencyApplicationPayload): Promise<{ message: string }> {
  return request('/agency-applications', {
    method: 'POST',
    body: {
      first_name: payload.firstName,
      last_name: payload.lastName,
      agency_name: payload.agencyName,
      country: payload.country,
      email: payload.email,
      phone: payload.phone,
      message: payload.message,
      website: payload.website,
    },
  });
}

/* ------------------------------------------------------------------ */
/* Authentication                                                      */
/* ------------------------------------------------------------------ */

export async function login(email: string, password: string): Promise<AuthUser> {
  const data = await request<{ token: string; user: AuthUser }>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });

  setToken(data.token);
  return data.user;
}

export async function me(): Promise<AuthUser> {
  return request<AuthUser>('/auth/me', { auth: true });
}

export function forgotPassword(email: string): Promise<{ message: string }> {
  return request('/auth/forgot-password', { method: 'POST', body: { email } });
}

export function resetPassword(payload: {
  token: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}): Promise<{ message: string }> {
  return request('/auth/reset-password', {
    method: 'POST',
    body: {
      token: payload.token,
      email: payload.email,
      password: payload.password,
      password_confirmation: payload.passwordConfirmation,
    },
  });
}

export async function logout(): Promise<void> {
  try {
    await request('/auth/logout', { method: 'POST', auth: true });
  } catch {
    // token may already be invalid
  } finally {
    setToken(null);
  }
}

/* ------------------------------------------------------------------ */
/* Static fallback (used when the API is unreachable)                  */
/* ------------------------------------------------------------------ */

const staticNews: NewsItem[] = rawNews;
const staticMembers: MemberItem[] = rawMembers;
const staticAgencies: AgencyItem[] = rawAgencies;
const staticRegulations: RegulationItem[] = rawRegulations;

const staticEvents: EventItem[] = rawEvents.map((event) => ({
  ...event,
  slug: String(event.id),
}));

const staticDocuments: DocumentItem[] = [
  { id: 1, code: 'ICAO Annex 14 – Ed. 9', title: 'Aérodromes — Volume I : Conception et exploitation des aérodromes', org: 'ICAO', date: '2026-01-01', downloadUrl: null },
  { id: 2, code: 'ICAO Doc 8168', title: 'Exploitation des aéronefs — Procédures de navigation aérienne', org: 'ICAO', date: '2025-07-01', downloadUrl: null },
  { id: 3, code: 'IATA DGR 65th Edition', title: 'Réglementations sur les marchandises dangereuses', org: 'IATA', date: '2024-01-01', downloadUrl: null },
  { id: 4, code: 'EU Reg 2026/1234', title: 'Règlement européen sur le transport aérien international', org: 'UE', date: '2026-08-01', downloadUrl: null },
  { id: 5, code: 'ASECNA Circ. 2026-14', title: "Circulaire sur les procédures d'approche aux instruments", org: 'ASECNA', date: '2026-06-15', downloadUrl: null },
];

const staticPublications: PublicationItem[] = [
  { id: 1, title: 'Rapport annuel ATAF 2025', type: 'Rapport annuel', date: '2026-07-01', pages: 48 },
  { id: 2, title: 'Bulletin trimestriel ATAF — T2 2026', type: 'Bulletin', date: '2026-06-01', pages: 24 },
  { id: 3, title: 'Guide pratique : mise en conformité ICAO pour les compagnies francophones', type: 'Guide', date: '2026-05-01', pages: 72 },
  { id: 4, title: 'Étude ATAF sur la connectivité aérienne en Afrique francophone', type: 'Étude', date: '2026-03-01', pages: 96 },
  { id: 5, title: 'Bulletin trimestriel ATAF — T1 2026', type: 'Bulletin', date: '2026-03-01', pages: 20 },
];
