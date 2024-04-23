import { Box, Heading, Text, css } from "@kuma-ui/core";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { PostDetail } from "../mocks/server";

const fetchPostDetail = async (postId: string) => {
  const res = await fetch(`https://examples.com/posts/${postId}`);
  if (res.ok) {
    return (await res.json()) as PostDetail;
  }
};

const postDetailQueryOption = (postId: string) =>
  queryOptions({
    queryKey: ["post", postId],
    queryFn: () => fetchPostDetail(postId),
    staleTime: Number.POSITIVE_INFINITY,
  });

export const Route = createFileRoute("/posts/$id")({
  component: PostDetailPage,
  loader: async ({ params, context: { queryClient } }) => {
    return queryClient.ensureQueryData(postDetailQueryOption(params.id));
  },
});

function PostDetailPage() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(postDetailQueryOption(id));
  return (
    <>
      <Heading as="h2">Post Detail</Heading>
      <Box
        className={css`
          width: 400px;
          overflow: hidden;
        `}
      >
        <Text>{data?.content}</Text>
      </Box>
    </>
  );
}
