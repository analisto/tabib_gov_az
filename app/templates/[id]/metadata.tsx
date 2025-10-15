import { Metadata } from 'next'

interface Template {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  previewImage: string
  techStack: string[]
  price: number
  isPaid: boolean
  user: {
    name: string
  }
}

async function getTemplate(id: string): Promise<Template | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://www.mwp.codes'
    const res = await fetch(`${baseUrl}/api/templates/${id}`, {
      cache: 'no-store'
    })

    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    console.error('Failed to fetch template for metadata:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const template = await getTemplate(params.id)

  if (!template) {
    return {
      title: 'Template Not Found',
      description: 'The requested template could not be found.'
    }
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'https://www.mwp.codes'
  const priceText = template.isPaid && Number(template.price) > 0
    ? `$${Number(template.price).toFixed(2)}`
    : 'Free'

  return {
    title: `${template.title} - ${priceText} ${template.category} Template`,
    description: `${template.description} Built with ${template.techStack.slice(0, 3).join(', ')}. ${priceText} template by ${template.user.name}.`,
    keywords: [
      template.title,
      ...template.tags,
      ...template.techStack,
      template.category,
      'mvp template',
      'web app template',
      'full-stack template'
    ],
    authors: [{ name: template.user.name }],
    openGraph: {
      title: `${template.title} - ${priceText}`,
      description: template.description,
      images: [
        {
          url: template.previewImage,
          width: 1200,
          height: 630,
          alt: template.title
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${template.title} - ${priceText}`,
      description: template.description,
      images: [template.previewImage],
    },
    alternates: {
      canonical: `/templates/${params.id}`
    }
  }
}
