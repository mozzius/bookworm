/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { type Book, type User } from "@prisma/client";

import { BookInfo } from "./book-info";
import { RatingPrompt } from "./rating-prompt";

interface Props {
  book: Book & {
    user: User;
  };
}

export const BookCard = ({ book }: Props) => {
  const [infoOpen, setInfoOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);

  return (
    <>
      <div
        key={book.id}
        className="relative h-14 w-[272px] shrink-0 cursor-pointer overflow-hidden rounded-sm bg-blue-500 pl-2 pr-1 pt-1 leading-snug text-white"
        onClick={() => setInfoOpen(true)}
      >
        <p className="pointer-events-none relative z-20">
          <span className="font-bold">{book.title}</span> by {book.author}
        </p>
        {book.image && (
          <img
            src={book.image}
            alt=""
            className="absolute left-0 top-0 z-10 h-full w-full object-cover opacity-10 transition-transform duration-300 hover:scale-125"
          />
        )}
      </div>
      <BookInfo
        book={book}
        show={infoOpen}
        onClose={() => setInfoOpen(false)}
        onReview={() => setRatingOpen(true)}
      />
      <RatingPrompt
        book={book}
        isOpen={ratingOpen}
        onClose={() => setRatingOpen(false)}
      />
    </>
  );
};
