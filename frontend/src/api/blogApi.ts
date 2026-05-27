import { apiFetch } from './client'
import type { ApiPostBlog } from './types'

export async function getPosts(opts?: {
  publicados?: boolean
  etiqueta?: string
  skip?: number
  limit?: number
}) {
  const q = new URLSearchParams()
  if (opts?.publicados !== undefined)
    q.set('publicados', String(opts.publicados))
  if (opts?.etiqueta) q.set('etiqueta', opts.etiqueta)
  if (opts?.skip !== undefined) q.set('skip', String(opts.skip))
  if (opts?.limit !== undefined) q.set('limit', String(opts.limit))
  const qs = q.toString()
  return apiFetch<ApiPostBlog[]>(`/blog/posts${qs ? `?${qs}` : ''}`)
}

export async function postBlogPost(
  token: string,
  body: {
    titulo: string
    slug: string
    resumen: string
    contenido: string
    publicado: boolean
    etiquetas: string[]
  },
) {
  return apiFetch<ApiPostBlog>('/blog/posts', {
    method: 'POST',
    body,
    token,
  })
}

export async function putBlogPost(
  token: string,
  id: string,
  body: {
    titulo: string
    slug: string
    resumen: string
    contenido: string
    publicado: boolean
    etiquetas: string[]
  },
) {
  return apiFetch<ApiPostBlog>(`/blog/posts/${id}`, {
    method: 'PUT',
    body,
    token,
  })
}

export async function patchBlogPost(
  token: string,
  id: string,
  body: Partial<{
    titulo: string
    slug: string
    resumen: string
    contenido: string
    publicado: boolean
    etiquetas: string[]
  }>,
) {
  return apiFetch<ApiPostBlog>(`/blog/posts/${id}`, {
    method: 'PATCH',
    body,
    token,
  })
}

export async function deleteBlogPost(token: string, id: string) {
  return apiFetch<void>(`/blog/posts/${id}`, {
    method: 'DELETE',
    token,
  })
}
