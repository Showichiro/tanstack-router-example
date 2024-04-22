import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";

export type Post = {
  id: number;
  title: string;
  content: string;
  date: Date;
  comments: number;
  likes: number;
};

export const worker = setupWorker(
  http.get("https://examples.com/posts", ({ request }) => {
    const url = new URL(request.url);
    const page = Number.parseInt(url.searchParams.get("page") ?? "0");
    const pageSize = 5;
    const data = Array(pageSize)
      .fill(0)
      .map<Post>((_, i) => {
        return {
          id: page * pageSize + i,
          title: `Post ${page * pageSize + i}`,
          content: `Content ${page * pageSize + i}`,
          date: new Date(),
          comments: Math.floor(Math.random() * 30),
          likes: Math.floor(Math.random() * 30),
        };
      });

    return HttpResponse.json({ posts: data, hasMore: true });
  }),
  http.post("https://examples.com/login", async ({ request }) => {
    return HttpResponse.json({
      message: "Login successful",
      username: JSON.parse(await request.text()).username,
    });
  }),
  http.post("https://examples.com/logout", () => {
    return HttpResponse.json({ message: "Logout successful" });
  }),
);
