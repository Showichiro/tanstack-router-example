import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";

export type Post = {
  id: number;
  title: string;
};

export type PostDetail = {
  id: number;
  title: string;
  content: string;
};

const loremIpsumTitles = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Duis nec nibh euismod, vulputate eros ut, suscipit nibh.",
  "Nullam at nibh id nisl sodales ultricies.",
  "Aliquyam facer clita ea at voluptua justo.",
  "Etiam eget eros nec nisl sodales ultricies.",
  "Amet wisi et eirmod clita rebum iriure.",
  "Dolore eu voluptua facilisis ipsum aliquyam rebum",
  "Ut justo ea dolor ut facilisi takimata",
];

const loremIpsums = [
  "Et amet sadipscing lorem gubergren dolor. Nam velit sed at consequat lorem aliquyam sed amet no vulputate clita volutpat ipsum ipsum invidunt iriure dolor lorem. Ipsum dolore diam est in kasd sea consequat voluptua lorem. Labore invidunt veniam sanctus molestie diam diam kasd duo et quis eros sit labore nisl sed mazim et rebum. Ut nam diam voluptua vero aliquyam vulputate et diam nostrud sed luptatum sit eos. Voluptua takimata at eu diam possim placerat invidunt. Nisl diam vero et sed qui blandit veniam clita et assum. Voluptua vel ex elitr consequat at ut sed sed no veniam erat stet. Ut invidunt veniam sit hendrerit at ut clita nonumy ut molestie justo voluptua esse. Adipiscing esse vero ipsum. Labore nonumy diam eirmod dolore wisi ut nibh laoreet clita eros congue sea dolor amet. Lorem iriure aliquyam augue vero rebum magna ea est veniam ipsum. Kasd nonumy sanctus facer feugait ipsum iriure rebum amet vero justo sit sed nonumy est voluptua sadipscing nonumy clita. Lorem facilisis sed no sadipscing vulputate wisi hendrerit no sadipscing gubergren soluta ut duo ipsum magna.",
  "Est lorem vero lorem takimata augue exerci duo ut molestie no est eos praesent ea accusam. Diam amet erat vel justo takimata lorem sanctus dolor sea sit facilisis et te vero ut diam. Sea eirmod erat justo veniam et vero invidunt in dolore est stet eleifend amet dolore ipsum. Dolore amet facer invidunt et et ipsum sanctus facer diam. Sit clita ut ipsum et erat vel dolore quis hendrerit est ea aliquam praesent quis placerat. Delenit et illum justo aliquip dolor ad takimata praesent erat eros velit qui. Vero sanctus vel labore luptatum sit ut diam dolore vero at diam justo at erat. Justo dolor erat wisi voluptua.",
  "Accusam amet gubergren facer consetetur labore eirmod illum wisi consetetur diam. No ipsum dolore dolor amet eu consetetur id kasd et at et diam sed zzril sed eos. Est tempor gubergren delenit option ut sanctus sanctus.",
  "Consetetur ipsum magna dolore. Erat labore ea et. Ut autem magna nonumy amet erat consetetur sea. Ea ut gubergren kasd sea nonumy justo tempor clita et autem ullamcorper justo sed dolor zzril. Consetetur iriure diam takimata dolore duis in dolor tempor accusam sanctus lorem. Ut ullamcorper amet esse veniam ipsum illum consetetur et sadipscing molestie elitr gubergren dolore iusto. Aliquyam hendrerit nostrud magna gubergren ut sit clita voluptua sea ut dolor nonummy accusam enim dolores et rebum sit. Wisi wisi autem eirmod aliquyam id lorem ea et labore aliquyam eos lorem eirmod et sed et ea. Lorem accumsan sea nostrud ipsum dolores amet ut aliquip amet est sea nonummy.",
];

export const worker = setupWorker(
  http.get("https://examples.com/posts", ({ request }) => {
    const url = new URL(request.url);
    const page = Number.parseInt(url.searchParams.get("page") ?? "0");
    const pageSize = 10;
    const data = Array(pageSize)
      .fill(0)
      .map<Post>((_, i) => {
        return {
          id: page * pageSize + i,
          title:
            loremIpsumTitles[
              Math.floor(Math.random() * loremIpsumTitles.length)
            ] ?? "",
        };
      });

    return HttpResponse.json({ posts: data, hasMore: true });
  }),
  http.get("https://examples.com/posts/:id", ({ params }) => {
    return HttpResponse.json<PostDetail>({
      id: Number.parseInt(params.id as string),
      title:
        loremIpsumTitles[Math.floor(Math.random() * loremIpsumTitles.length)],
      content: loremIpsums[Math.floor(Math.random() * loremIpsums.length)],
    });
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
