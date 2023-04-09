import { useEffect, useState } from "react";
import { Popup } from "./popup";
import { api } from "@/utils/api";
import { Book } from "@prisma/client";
import clsx from "clsx";

interface Props {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

export const RatingPrompt = ({ book, isOpen, onClose }: Props) => {
  const utils = api.useContext();
  const rate = api.books.rate.useMutation({
    onSuccess() {
      void utils.books.invalidate();
      onClose();
    },
  });
  const [rating, setRating] = useState(book.rating);
  const [review, setReview] = useState(book.review);

  // refresh state when props change
  useEffect(() => {
    setRating(book.rating);
    setReview(book.review);
  }, [book.rating, book.review]);

  return (
    <Popup isOpen={isOpen} title="How did you find it?" onClose={onClose}>
      <div className="flex gap-4">
        {Array.from({ length: 5 }, (_, i) => i).map((i) => (
          <button key={i} className={clsx("")} onClick={() => setRating(i + 1)}>
            {(rating ?? 0) > i ? "★" : "☆"}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <p>Review (optional)</p>
        <textarea
          className="mt-1 w-full border p-2"
          value={review ?? ""}
          onChange={(evt) => setReview(evt.target.value)}
        />
      </div>
      <button
        className="float-right mt-4 border-none bg-slate-600 px-4 py-2 text-white disabled:opacity-50"
        disabled={rate.isLoading}
        onClick={() =>
          rate.mutate({
            bookId: book.id,
            rating,
            review,
          })
        }
      >
        Submit review
      </button>
    </Popup>
  );
};
