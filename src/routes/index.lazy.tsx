import { Heading, Text } from "@kuma-ui/core";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useAuth } from "../global/auth";

export const Route = createLazyFileRoute("/")({
  component: Home,
});

function Home() {
  const auth = useAuth();
  return (
    <>
      <Heading as="h1" color="#333">
        Home
      </Heading>
      <Text>Hello, {auth.user}!</Text>
    </>
  );
}
