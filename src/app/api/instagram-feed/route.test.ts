import { describe, expect, it, vi } from "vitest";

const mockUpstream = {
  perfil_buscado: {
    username: "john",
    full_name: "John",
    is_private: false,
    profile_pic_url: "https://example.com/a.jpg",
  },
  fonte: "x",
  fonte_api: "y",
  perfis_na_lista: 0,
  perfis_publicos: 0,
  lista_perfis_publicos: [],
  posts: [],
  total_posts: 0,
  duracao_ms: 10,
};

vi.mock("@/server/security/fetch-timeout.modules", () => {
  return {
    fetchWithTimeout: vi.fn(async () => {
      return new Response(JSON.stringify(mockUpstream), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }),
  };
});

import { GET } from "./route";

describe("GET /api/instagram-feed", () => {
  it("returns 400 for invalid username", async () => {
    const req = new Request("http://localhost/api/instagram-feed?username=@@@");
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it("returns feed payload on success", async () => {
    const req = new Request("http://localhost/api/instagram-feed?username=john");
    const res = await GET(req);

    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.perfil_buscado.username).toBe("john");
    expect(Array.isArray(json.posts)).toBe(true);
  });
});
