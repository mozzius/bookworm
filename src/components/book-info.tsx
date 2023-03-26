/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @next/next/no-img-element */
import { type Book } from "@prisma/client";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { Popup } from "./popup";

interface Props {
  show: boolean;
  book: Book;
  onClose?: () => void;
}

export const BookInfo = ({ book, show, onClose }: Props) => {
  return (
    <Popup isOpen={show} title={book.title} onClose={onClose}>
      <div className="flex justify-between">
        <div>
          <p>By {book.author}</p>
          <p>Published in {book.firstPublishYear}</p>
          <p>Finished on {format(book.readAt, "dd/MM/yyyy")}</p>
        </div>
        {book.image && <img src={book.image} alt={book.title} />}
      </div>
      <div className="mt-4 flex justify-between">
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
