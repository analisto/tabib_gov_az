import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://www.mwp.codes'

  // Static routes
  const routes = [
    '',
    '/templates',
    '/about',
    '/privacy',
    '/terms',
    '/login',
    '/register',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // You can fetch dynamic template URLs here
  // Example:
  // const templates = await fetchTemplates()
  // const templateRoutes = templates.map((template) => ({
  //   url: `${baseUrl}/templates/${template.id}`,
  //   lastModified: new Date(template.updatedAt),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.6,
  // }))

  return [...routes]
}
