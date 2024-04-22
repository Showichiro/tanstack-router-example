import { Box, Button, Flex, css } from "@kuma-ui/core";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Login } from "../components/Login";
import { type AuthContext, useAuth } from "../global/auth";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  auth: AuthContext | null;
}>()({
  component: RootComponent,
});

const linkAsButtonStyle = css`
  text-decoration: none;
  color: inherit;
`;

function RootComponent() {
  const auth = useAuth();
  return (
    <>
      <Flex justify="end" alignItems="end">
        {auth.isAuthenticated && (
          <Box as="button" marginX={2}>
            <Link to="/" className={linkAsButtonStyle}>
              Home
            </Link>
          </Box>
        )}
        {auth.isAuthenticated && (
          <Box as="button" marginX={2}>
            <Link to="/posts" className={linkAsButtonStyle}>
              Posts
            </Link>
          </Box>
        )}
        {auth.isAuthenticated && (
          <Button type="button" onClick={() => auth.logout()} marginX={2}>
            Logout
          </Button>
        )}
      </Flex>
      {auth.isAuthenticated && <hr />}
      {auth.isAuthenticated && <Outlet />}
      {!auth.isAuthenticated && <Login />}
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  );
}
