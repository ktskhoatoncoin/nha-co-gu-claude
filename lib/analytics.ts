"use client";

import { AffiliateClickEvent, Platform } from "@/lib/types";

// V1 DEMO STORE.
// In production this file should POST to /api/track (or call Supabase's
// client directly) to insert a row into the `affiliate_clicks` table
// described in README.md. Keeping everything behind these functions means
// swapping the storage backend never requires touching a UI component.

const STORAGE_KEY = "ncg_analytics_events";
const SESSION_KEY = "ncg_session_id";

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let id = window.sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `sess_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    window.sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function getDeviceType(): "mobile" | "desktop" | "tablet" {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function persistEvent(event: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const events = raw ? JSON.parse(raw) : [];
    events.push(event);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // Demo storage only — safe to ignore quota/parse errors in V1.
  }
}

export function trackAffiliateClick(params: {
  productId: string;
  platform: Platform;
  page: string;
  campaign?: string;
  source?: string;
  medium?: string;
  content?: string;
}): AffiliateClickEvent {
  const event: AffiliateClickEvent = {
    id: `click_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    productId: params.productId,
    platform: params.platform,
    timestamp: new Date().toISOString(),
    referrer: typeof document !== "undefined" ? document.referrer : "",
    page: params.page,
    deviceType: getDeviceType(),
    sessionId: getSessionId(),
    campaign: params.campaign,
    source: params.source,
    medium: params.medium,
    content: params.content,
  };
  persistEvent({ type: "affiliate_click", ...event });
  return event;
}

export function trackProductView(productId: string) {
  persistEvent({
    type: "product_view",
    productId,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
  });
}

export function trackSearch(query: string, resultCount: number) {
  persistEvent({
    type: "search",
    query,
    resultCount,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
  });
}

export function trackCategoryView(categoryId: string) {
  persistEvent({
    type: "category_view",
    categoryId,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
  });
}

export function trackArticleView(articleId: string) {
  persistEvent({
    type: "article_view",
    articleId,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
  });
}

export function trackOutboundClick(url: string, context: string) {
  persistEvent({
    type: "outbound_click",
    url,
    context,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
  });
}

export function getStoredEvents(): Array<Record<string, unknown>> {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearStoredEvents() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
