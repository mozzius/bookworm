import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const openLibrarySearchSchema = z.object({
  docs: z.array(
    z
      .object({
        key: z.string(),
        title: z.string(),
        author_name: z.array(z.string()).optional(),
        first_publish_year: z.number().optional(),
        cover_i: z.number().optional(),
        cover_edition_key: z.string().optional(),
        lccn: z.array(z.string()).optional(),
        oclc: z.array(z.string()).optional(),
        isbn: z.array(z.string()).optional(),
      })
      .passthrough(),
  ),
});

const imgUrl = (kind: string, id: string) => (size: "S" | "M" | "L") =>
  `https://covers.openlibrary.org/b/${kind}/${id}-${size}.jpg`;

export const booksRouter = createTRPCRouter({
  everyone: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany({
      orderBy: {
        books: {
          _count: "desc",
        },
      },
      include: {
        books: {
          where: {
            readAt: {
              gte: new Date(new Date().getFullYear().toString()),
            },
          },
          include: {
            user: true,
          },
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
      "https://openlibrary.org/search.json?q=" + encodeURIComponent(input),
    );
    if (!res.ok) throw new Error("Failed to search books");
    const json = openLibrarySearchSchema.parse(await res.json());
    console.log(json.docs[0]);
    return json.docs.map((doc) => {
      let img = (size: "S" | "M" | "L") => (
        void size, undefined as string | undefined
      );
      if (doc.cover_i) img = imgUrl("id", doc.cover_i.toString());
      else if (doc.cover_edition_key)
        img = imgUrl("olid", doc.cover_edition_key);
      else if (doc.lccn?.[0]) img = imgUrl("lccn", doc.lccn[0]);
      else if (doc.oclc?.[0]) img = imgUrl("oclc", doc.oclc[0]);
      else if (doc.isbn?.[0]) img = imgUrl("isbn", doc.isbn[0]);

      return {
        workId: doc.key.split("/").pop() as string,
        title: doc.title,
        author: doc.author_name?.[0],
        firstPublishYear: doc.first_publish_year,
        images: {
          small: img("S"),
          medium: img("M"),
          large: img("L"),
        },
      };
    });
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
        format: z.enum(["BOOK", "AUDIOBOOK"]).optional(),
      }),
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
          format: input.format,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      return book;
    }),
  rate: protectedProcedure
    .input(
      z.object({
        bookId: z.string(),
        rating: z.number().min(1).max(5).nullable(),
        review: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const book = await ctx.prisma.book.findFirst({
        where: { id: input.bookId },
      });
      if (!book) throw new Error("Book not found");
      if (book.userId !== ctx.session.user.id)
        throw new Error("Not authorized");

      await ctx.prisma.book.update({
        where: { id: input.bookId },
        data: {
          rating: input.rating,
          review: input.review,
        },
      });
    }),
});
