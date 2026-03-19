import { useCallback, useEffect, useState } from "react";
import { createActorWithConfig } from "../config";
import { DEFAULT_CONTENT, type SiteContent } from "../types/content";

const STORAGE_KEY = "rt_site_content_cache";

function loadCached(): SiteContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SiteContent;
      return {
        ...DEFAULT_CONTENT,
        ...parsed,
        portfolio: {
          ...DEFAULT_CONTENT.portfolio,
          ...(parsed.portfolio ?? {}),
        },
      };
    }
  } catch {
    // ignore
  }
  return DEFAULT_CONTENT;
}

function saveCache(content: SiteContent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  } catch {
    // ignore
  }
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(loadCached);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    createActorWithConfig()
      .then((actor) => {
        actor
          .getContent()
          .then((result) => {
            if (cancelled) return;
            if (result && result.length > 0 && result[0]) {
              try {
                const parsed = JSON.parse(result[0]) as SiteContent;
                const merged = {
                  ...DEFAULT_CONTENT,
                  ...parsed,
                  portfolio: {
                    ...DEFAULT_CONTENT.portfolio,
                    ...(parsed.portfolio ?? {}),
                  },
                };
                setContent(merged);
                saveCache(merged);
              } catch {
                // ignore parse errors
              }
            }
            setLoading(false);
          })
          .catch(() => setLoading(false));
      })
      .catch(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const updateContent = useCallback(async (next: SiteContent) => {
    setContent(next);
    saveCache(next);
    try {
      const actor = await createActorWithConfig();
      await actor.setContent(JSON.stringify(next));
    } catch (e) {
      console.error("Failed to save content to backend", e);
    }
  }, []);

  return { content, updateContent, loading };
}
