/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @next/next/no-img-element */
import { type User, type Book } from "@prisma/client";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { useSession } from "next-auth/react";

import { Popup } from "./popup";

interface Props {
  show: boolean;
  book: Book & {
    user: User;
  };
  onClose?: () => void;
  onReview?: () => void;
}

export const BookInfo = ({ book, show, onClose, onReview }: Props) => {
  const session = useSession();
  return (
    <Popup isOpen={show} title={book.title} onClose={onClose}>
      <div className="flex flex-col justify-between gap-6 sm:flex-row">
        <div>
          <p>By {book.author}</p>
          <p>Published in {book.firstPublishYear}</p>
          <p className="mt-3">
            Finished on {format(book.readAt, "dd/MM/yyyy")}
          </p>
          {book.rating && (
            <p>
              Rating: {"★".repeat(book.rating)}
              {"☆".repeat(5 - book.rating)}
            </p>
          )}
          {book.review && (
            <div className="mt-3 rounded border border-slate-400 bg-slate-50   py-1 px-2">
              <p className="text-sm">{book.user.name}&apos;s Review</p>
              {book.review.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}
          {session.data?.user?.id === book.user.id && (
            <button className="mt-4 border-none underline" onClick={onReview}>
              {book.rating || book.review ? "Edit Review" : "Add Review"}
            </button>
          )}
        </div>
        {book.image && (
          <div className="w-full shrink-0 py-2 sm:w-1/3 sm:py-0">
            <img src={book.image} alt={book.title} className="mx-auto" />
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-wrap justify-between gap-4">
        <button
          className="flex items-center gap-2 rounded-sm border px-4 py-2"
          onClick={() => {
            window.open(
              `https://openlibrary.org/works/${book.workId}`,
              "_blank"
            );
          }}
        >
          View on OpenLibrary <ExternalLink className="h-4 w-4" />
        </button>
        <button
          className="rounded-sm border-none bg-slate-600 px-4 py-2 text-white shadow"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </Popup>
  );
};
