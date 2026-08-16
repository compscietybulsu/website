"use client";

import { useEffect, useState } from "react";
import { api } from "./api";

const CACHE_PREFIX = "compsciety_cache_";

function readCache(key) {
    try {
        const raw = localStorage.getItem(CACHE_PREFIX + key);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function writeCache(key, data) {
    try {
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(data));
    } catch {
        // Private browsing / storage full — caching is a nice-to-have, fail silently.
    }
}

// Fetches `path`, caching the result in localStorage under `cacheKey`.
//
// IMPORTANT: data/loading always start identical on server and client
// ([] / true) — localStorage is only ever touched inside useEffect, which
// runs strictly after hydration. Reading it during render (e.g. via a
// useState lazy initializer) would make the server's render (no
// localStorage) diverge from the client's first render (real
// localStorage), which is exactly what caused the hydration error.
export function useCachedFetch(cacheKey, path) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cached = readCache(cacheKey);
        if (cached) {
            setData(cached);
            setLoading(false);
        }

        api
            .get(path)
            .then((fresh) => {
                setData(fresh);
                writeCache(cacheKey, fresh);
            })
            .catch(() => {
                // Fetch failed — keep whatever we already have (cached or empty)
                // instead of clearing it.
            })
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path]);

    return { data, loading };
}