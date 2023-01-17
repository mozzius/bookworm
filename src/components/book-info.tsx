/* eslint-disable @next/next/no-img-element */
import { Book } from "@prisma/client";
import { format } from "date-fns";
import { Popup } from "./popup";

interface Props {
  book: Book | null;
  onClose?: () => void;
}

export const BookInfo = ({ book, onClose }: Props) => {
  return (
    <Popup isOpen={!!book} title={book?.title ?? ""} onClose={onClose}>
      {!!book && (
        <>
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
              className="border px-4 py-2"
              onClick={() => {
                window.open(
                  `https://openlibrary.org/works/${book.workId as string}`,
                  "_blank"
                );
              }}
            >
              View on OpenLibrary
            </button>
            <button
              className="border-none bg-slate-600 px-4 py-2 text-white"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </>
      )}
    </Popup>
  );
};
