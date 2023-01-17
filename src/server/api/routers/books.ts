import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

const openLibrarySearchSchema = z.object({
  docs: z.array(
    z
      .object({
        key: z.string(),
        title: z.string(),
        author_name: z.array(z.string()).optional(),
        first_publish_year: z.number().optional(),
        lccn: z.array(z.string()).optional(),
      })
      .passthrough()
  ),
});

export const booksRouter = createTRPCRouter({
  everyone: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany({
      include: {
        books: {
          orderBy: {
            readAt: "asc",
          },
        },
      },
    });
  }),
  setName: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
        },
      });
      return user;
    }),
  search: protectedProcedure.input(z.string()).query(async ({ input }) => {
    const res = await fetch(
      "https://openlibrary.org/search.json?q=" + encodeURIComponent(input)
    );
    if (!res.ok) throw new Error("Failed to search books");
    const json = openLibrarySearchSchema.parse(await res.json());
    // console.log(json.docs[0]);
    return json.docs.map((doc) => ({
      workId: doc.key.split("/").pop() as string,
      title: doc.title,
      author: doc.author_name?.[0],
      firstPublishYear: doc.first_publish_year,
      images: {
        small: `https://covers.openlibrary.org/b/lccn/${
          doc.lccn?.[0] ?? ""
        }-S.jpg`,
        medium: `https://covers.openlibrary.org/b/lccn/${
          doc.lccn?.[0] ?? ""
        }-M.jpg`,
        large: `https://covers.openlibrary.org/b/lccn/${
          doc.lccn?.[0] ?? ""
        }-L.jpg`,
      },
    }));
  }),
  add: protectedProcedure
    .input(
      z.object({
        workId: z.string(),
        title: z.string(),
        author: z.string().optional(),
        readAt: z.date(),
        firstPublishYear: z.number().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const book = await ctx.prisma.book.create({
        data: {
          workId: input.workId,
          title: input.title,
          author: input.author,
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
