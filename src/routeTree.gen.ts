/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PostsIdImport } from './routes/posts.$id'
import { Route as PostsIndexImport } from './routes/posts.index'

// Create Virtual Routes

const PostsLazyImport = createFileRoute('/posts')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const PostsLazyRoute = PostsLazyImport.update({
  path: '/posts',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/posts.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const PostsIndexRoute = PostsIndexImport.update({
  path: '/',
  getParentRoute: () => PostsLazyRoute,
} as any)

const PostsIdRoute = PostsIdImport.update({
  path: '/$id',
  getParentRoute: () => PostsLazyRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/posts': {
      preLoaderRoute: typeof PostsLazyImport
      parentRoute: typeof rootRoute
    }
    '/posts/$id': {
      preLoaderRoute: typeof PostsIdImport
      parentRoute: typeof PostsLazyImport
    }
    '/posts/': {
      preLoaderRoute: typeof PostsIndexImport
      parentRoute: typeof PostsLazyImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexLazyRoute,
  PostsLazyRoute.addChildren([PostsIdRoute, PostsIndexRoute]),
])

/* prettier-ignore-end */