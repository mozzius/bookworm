import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

const openLibrarySearchSchema = z.object({
  docs: z.array(
    z.object({
      title: z.string(),
      author_name: z.array(z.string()),
      isbn: z.array(z.string()),
      first_publish_year: z.number(),
    })
  ),
});

export const booksRouter = createTRPCRouter({
  everyone: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany({
      include: {},
    });
  }),
  search: protectedProcedure.input(z.string()).query(async ({ input }) => {
    const res = await fetch(
      "https://openlibrary.org/search.json?q=" + encodeURIComponent(input)
    );
    const json = openLibrarySearchSchema.parse(await res.json());
    return json.docs.map((doc) => ({
      title: doc.title,
      author: doc.author_name[0],
      isbn: doc.isbn[0],
      firstPublishYear: doc.first_publish_year,
      images: {
        small: `https://covers.openlibrary.org/b/isbn/${
          doc.isbn[0] as string
        }-S.jpg`,
        medium: `https://covers.openlibrary.org/b/isbn/${
          doc.isbn[0] as string
        }-M.jpg`,
        large: `https://covers.openlibrary.org/b/isbn/${
          doc.isbn[0] as string
        }-L.jpg`,
      },
    }));
  }),
  add: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        author: z.string(),
        isbn: z.string(),
        readAt: z.date(),
        firstPublishYear: z.number(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const book = await ctx.prisma.book.create({
        data: {
          title: input.title,
          author: input.author,
          isbn: input.isbn,
          readAt: input.readAt,
          image: input.image,
          firstPublishYear: input.firstPublishYear,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      return book;
    }),
});
