import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getBlogPosts } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'

export async function generateStaticParams() {
  let posts = getBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export function generateMetadata({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug)
  if (!post) {
    return
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default function Blog({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <section className="mx-auto w-full max-w-2xl px-4 sm:px-6 py-8">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'My Portfolio',
            },
          }),
        }}
      />

      {/* Pixel breadcrumb */}
      <p className="pixel-label mb-6" style={{ color: 'rgba(179,68,108,0.7)' }}>
        // blog / entry
      </p>

      <h1 className="title font-semibold text-2xl tracking-tighter">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-6 text-sm">
        <p
          style={{
            fontFamily: 'var(--font-pixel), monospace',
            fontSize: 8,
            color: 'rgba(179,68,108,0.7)',
            letterSpacing: '0.06em',
          }}
        >
          {formatDate(post.metadata.publishedAt)}
        </p>
      </div>

      {/* Pixel divider before content */}
      <div className="pixel-divider" style={{ marginBottom: 32 }} />

      <article className="prose">
        <CustomMDX source={post.content} />
      </article>

      {/* Back link */}
      <div style={{ marginTop: 48 }}>
        <div className="pixel-divider" style={{ marginBottom: 16 }} />
        <a
          href="/blog"
          style={{
            fontFamily: 'var(--font-pixel), monospace',
            fontSize: 8,
            color: 'rgba(179,68,108,0.8)',
            textDecoration: 'none',
            letterSpacing: '0.06em',
          }}
        >
          ← back to notebook
        </a>
      </div>
    </section>
  )
}
