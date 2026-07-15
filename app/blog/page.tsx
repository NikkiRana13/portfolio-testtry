// Blog index — server component: fetches posts on the server, passes them to
// the client-side NotebookScene so interactive open/close works without a
// client-side fetch (no fs access from 'use client' components).
import { getBlogPosts } from 'app/blog/utils'
import { NotebookScene } from 'app/components/notebook/NotebookScene'

export const metadata = {
  title: 'Blog',
  description: 'Thoughts, experiments, and things I\'m learning — Nikki\'s notebook.',
}

export default function BlogPage() {
  const posts = getBlogPosts()
  return <NotebookScene posts={posts} />
}
