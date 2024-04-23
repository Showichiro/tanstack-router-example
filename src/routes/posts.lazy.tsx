import { Box, Button, Flex, Heading, css } from "@kuma-ui/core";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Link, Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Post } from "../mocks/server";

export const Route = createLazyFileRoute("/posts")({
  component: Posts,
});

const fetchPosts = async (
  page = 0,
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
  const { data, isPlaceholderData, isLoading } = useQuery({
    queryKey: ["posts", page],
    queryFn: () => fetchPosts(page),
    placeholderData: keepPreviousData,
    staleTime: Number.POSITIVE_INFINITY,
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
      <Flex gap={4}>
        <Box
          marginX={4}
          className={css`
            width: 150px;
          `}
        >
          <Heading as="h1" color="#333">
            Posts
          </Heading>
          <ul>
            {isLoading && <li>Loading...</li>}
            {data?.posts.map((post) => (
              <li
                key={post.id}
                className={css`
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                `}
              >
                <Link to={"/posts/$id"} params={{ id: post.id.toString() }}>
                  <span>{post.title.substring(0, 20)}</span>
                </Link>
              </li>
            ))}
          </ul>
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
        </Box>
        <Box flex={1}>
          <Outlet />
        </Box>
      </Flex>
    </>
  );
}
