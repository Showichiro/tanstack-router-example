import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import packageJson from "../package.json";
import { AuthProvider, useAuth } from "./global/auth";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: { queryClient, auth: null },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const InnerApp = () => {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
};

async function enableMocking() {
  const { worker } = await import("./mocks/server");

  if (import.meta.env.DEV) {
    return worker.start();
  }
  return worker.start({
    serviceWorker: {
      url: `${packageJson.homepage}/mockServiceWorker.js`,
    },
  });
}

enableMocking().then(() => {
  // Render the app
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Failed to find the root element");
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <Suspense fallback="...loading">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <InnerApp />
          </AuthProvider>
        </QueryClientProvider>
      </Suspense>
    </StrictMode>,
  );
});
