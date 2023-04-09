/* eslint-disable @next/next/no-img-element */
import { type User, type Book } from "@prisma/client";
import { useState } from "react";
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
        className="relative h-14 w-[272px] shrink-0 cursor-pointer overflow-hidden rounded-sm bg-blue-500 pl-2 pt-1 leading-snug text-white"
        onClick={() => setInfoOpen(true)}
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
