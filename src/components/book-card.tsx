/* eslint-disable @next/next/no-img-element */
import { type Book } from "@prisma/client";
import { useState } from "react";
import { BookInfo } from "./book-info";

interface Props {
  book: Book;
}

export const BookCard = ({ book }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        key={book.id}
        className="relative h-14 w-[272px] shrink-0 rounded-sm cursor-pointer overflow-hidden bg-blue-500 pl-2 pt-1 leading-snug text-white"
        onClick={() => setOpen(true)}
      >
        <p className="pointer-events-none relative z-20">
          <span className="font-bold">{book.title}</span> by {book.author}
        </p>
        {book.image && (
          <img
            src={book.image}
            alt=""
            className="absolute top-0 left-0 z-10 h-full w-full object-cover opacity-10 transition-transform duration-300 hover:scale-125"
          />
        )}
      </div>
      <BookInfo book={book} show={open} onClose={() => setOpen(false)} />
    </>
  );
};
