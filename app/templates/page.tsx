import { prisma } from '@/lib/prisma'
import TemplatesClient from './TemplatesClient'

export const revalidate = 60 // revalidate every 60 seconds

export default async function TemplatesPage() {
  const templates = await prisma.template.findMany({
    include: {
      user: {
        select: { id: true, name: true, image: true },
      },
      analytics: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  // Serialize Decimal fields for client component
  const serialized = templates.map(t => ({
    ...t,
    price: t.price ? t.price.toString() : null,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
    analytics: t.analytics
      ? {
          ...t.analytics,
          averageViewTime: t.analytics.averageViewTime ? Number(t.analytics.averageViewTime) : null,
          createdAt: t.analytics.createdAt.toISOString(),
          updatedAt: t.analytics.updatedAt.toISOString(),
          lastViewedAt: t.analytics.lastViewedAt?.toISOString() ?? null,
        }
      : null,
  }))

  return <TemplatesClient initialTemplates={serialized} />
}
