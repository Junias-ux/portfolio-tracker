export type ApiResult<T = unknown> = { ok: true; data: T } | { ok: false; error: string };

/**
 * POST JSON vers une route API et renvoie un résultat uniforme.
 * Le message d'erreur affiché est celui du serveur ; s'il y a des erreurs
 * de validation par champ, on ajoute la première pour être plus précis.
 */
export async function postJson<T = unknown>(url: string, body: unknown): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const fieldErrors = data?.details as Record<string, string[]> | undefined;
      const firstDetail = fieldErrors ? Object.values(fieldErrors).flat()[0] : undefined;
      const base = data?.error ?? "Une erreur est survenue.";
      return { ok: false, error: firstDetail ? `${base} ${firstDetail}` : base };
    }
    return { ok: true, data: data as T };
  } catch {
    return { ok: false, error: "Impossible de joindre le serveur." };
  }
}
