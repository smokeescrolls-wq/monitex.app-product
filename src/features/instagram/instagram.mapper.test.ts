import { describe, expect, it } from "vitest"
import { mapFeedUpstreamToApp, mapProfileUpstreamToApp } from "./instagram.mapper"

describe("instagram.mapper", () => {
  it("maps profile upstream -> app contract", () => {
    const upstream = {
      source: "stalkea",
      duration: 123,
      data: {
        username: "leonardoalbano",
        full_name: "Leonardo",
        biography: "bio",
        profile_pic_url: "https://cdn.example/avatar.jpg",
        follower_count: 10,
        following_count: 5,
        media_count: 2,
        is_private: false,
        is_verified: true,
        user_id: "1",
        external_url: "https://example.com",
        _chaining_results: [],
      },
    }

    const mapped = mapProfileUpstreamToApp(upstream as any)

    expect(mapped.data.profileDetails.username).toBe("leonardoalbano")
    expect(mapped.data.profileDetails.fullName).toBe("Leonardo")
    expect(mapped.data.profileDetails.pictureUrl).toBe("https://cdn.example/avatar.jpg")
    expect(mapped.data.profileDetails.followersCount).toBe(10)
    expect(mapped.data.profileDetails.followsCount).toBe(5)
    expect(mapped.data.profileDetails.postsCount).toBe(2)
    expect(mapped.durationMs).toBe(123)
  })

  it("maps feed upstream -> app contract", () => {
    const upstream = {
      perfil_buscado: {
        username: "x",
        full_name: "X",
        is_private: false,
        profile_pic_url: "https://cdn.example/x.jpg",
      },
      fonte: "stalkea",
      fonte_api: "stalkea",
      perfis_na_lista: 2,
      perfis_publicos: 1,
      lista_perfis_publicos: [
        { username: "a", full_name: "A", profile_pic_url: "https://cdn.example/a.jpg", is_verified: true },
      ],
      posts: [
        {
          de_usuario: { username: "a", full_name: "A", profile_pic_url: "https://cdn.example/a.jpg" },
          post: {
            id: "p1",
            shortcode: "sc",
            image_url: "https://cdn.example/i.jpg",
            video_url: null,
            is_video: false,
            caption: "hello",
            like_count: 1,
            comment_count: 2,
            taken_at: 1700000000,
          },
        },
      ],
      total_posts: 1,
      duracao_ms: 777,
    }

    const mapped = mapFeedUpstreamToApp(upstream as any)

    expect(mapped.data.searchedProfile.username).toBe("x")
    expect(mapped.data.publicProfilesCount).toBe(1)
    expect(mapped.data.postsTotal).toBe(1)
    expect(mapped.durationMs).toBe(777)
    expect(mapped.data.posts[0].post.id).toBe("p1")
  })
})
