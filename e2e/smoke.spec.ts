import { test, expect } from '@playwright/test'

test('happy path: home -> analysis -> feed', async ({ page }) => {
  await page.route('**/api/instagram?**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          profileDetails: {
            isPrivate: false,
            isVerified: false,
            fullName: 'John',
            username: 'john',
            biography: 'bio',
            followersCount: 1,
            followsCount: 2,
            postsCount: 3,
            pictureUrl: 'https://example.com/a.jpg'
          }
        }
      })
    })
  })

  await page.route('**/api/instagram-feed?**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          items: [
            {
              id: '1',
              mediaUrl: 'https://example.com/m.jpg',
              thumbnailUrl: 'https://example.com/t.jpg',
              caption: 'hello #tag',
              likesCount: 1,
              commentsCount: 2,
              timestamp: '2025-01-01T00:00:00.000Z'
            }
          ]
        }
      })
    })
  })

  await page.goto('/')
  await page.getByLabel('Usuário do Instagram').fill('john')
  await page.getByRole('button', { name: 'Analisar' }).click()

  await expect(page.getByText('Confirmação')).toBeVisible()
  await page.getByRole('button', { name: 'Confirmar e continuar' }).click()

  await expect(page.getByText('Feed (preview)')).toBeVisible()
  await expect(page.getByText(/hello/i)).toBeVisible()
})
