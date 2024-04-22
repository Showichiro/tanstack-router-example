import { Button, Heading } from "@kuma-ui/core";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Post } from "../mocks/server";

export const Route = createLazyFileRoute("/posts")({
  component: Posts,
});

const fetchPosts = async (
  page = 0
): Promise<{
  posts: ReadonlyArray<Post>;
  hasMore: boolean;
}> => {
  const res = await fetch(`https://examples.com/posts?page=${page}`);
  if (res.ok) {
    return (await res.json()) as {
      posts: ReadonlyArray<Post>;
      hasMore: boolean;
    };
  }
  throw new Error("Failed to fetch posts");
};

function Posts() {
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();
  const { data, isPlaceholderData } = useQuery({
    queryKey: ["posts", page],
    queryFn: () => fetchPosts(page),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!isPlaceholderData && data?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: ["posts", page + 1],
        queryFn: () => fetchPosts(page + 1),
      });
    }
  }, [data, isPlaceholderData, page, queryClient]);

  return (
    <>
      <Heading as="h1" color="#333">
        Posts
      </Heading>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>content</th>
          </tr>
        </thead>
        <tbody>
          {data?.posts.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.content}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button
        type="button"
        onClick={() => setPage((old) => Math.max(old - 1, 0))}
        disabled={page === 0}
      >
        Prev
      </Button>{" "}
      <Button
        type="button"
        onClick={() => {
          setPage((old) => (data?.hasMore ? old + 1 : old));
        }}
        disabled={isPlaceholderData || !data?.hasMore}
      >
        Next
      </Button>
    </>
  );
}
