import { Heading, Text } from "@kuma-ui/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts/")({
  component: NonSelected,
});

function NonSelected() {
  return (
    <>
      <Heading as="h2">Post Detail</Heading>
      <Text>Select a Post.</Text>
    </>
  );
}
