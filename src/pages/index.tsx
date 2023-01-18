/* eslint-disable @next/next/no-img-element */
import { type InferGetServerSidePropsType, type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { getDayOfYear } from "date-fns";

import { api } from "@/utils/api";
import { NamePrompt } from "@/components/name-prompt";
import { AddBookPopup } from "@/components/add-book-popup";
import { type Book } from "@prisma/client";
import { BookInfo } from "@/components/book-info";

const days = Array.from({ length: 365 }).map((_, index) => {
  const date = new Date();
  date.setMonth(0);
  date.setDate(index + 1);
  return date;
});

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ dayOfYear }) => {
  const session = useSession();
  const users = api.books.everyone.useQuery();
  const [addBookPopupOpen, setAddBookPopupOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<null | Book>(null);

  return (
    <>
      <Head>
        <title>52 Books</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NamePrompt />
      <AddBookPopup
        isOpen={addBookPopupOpen}
        onClose={() => setAddBookPopupOpen(false)}
      />
      <BookInfo book={selectedBook} onClose={() => setSelectedBook(null)} />
      <div className="flex min-h-screen flex-col">
        <header className="flex h-20 w-full grow-0 items-center justify-between px-4">
          <h1 className="w-full text-4xl font-bold">52 Books</h1>
          {session.status === "authenticated" ? (
            <button onClick={() => void signOut()}>Logout</button>
          ) : (
            <button onClick={() => void signIn()}>Login</button>
          )}
        </header>
        <main className="flex flex-1 flex-col items-center justify-center">
          {session.status === "authenticated" && (
            <button
              onClick={() => setAddBookPopupOpen(true)}
              className="mb-4 bg-slate-500 py-2 px-4 text-white"
            >
              Add book
            </button>
          )}
          <div className="flex w-full flex-1 flex-col overflow-x-scroll px-8">
            <div className="relative flex space-x-2 pt-8">
              {days.map((day) => (
                <div key={day.getTime()}>
                  {day.getDate() === 1 && (
                    <p className="absolute top-0">
                      {day.toLocaleString("default", { month: "long" })}
                    </p>
                  )}
                  <div className="h-8 w-8 bg-slate-200 pl-1">
                    {day.getDate()}
                  </div>
                </div>
              ))}
            </div>
            <div
              className="mt-2 h-8 bg-red-500"
              style={{ width: (32 + 8) * dayOfYear - 8 - 16 }}
            />
            {users.data &&
              users.data.map((user) => (
                <div key={user.id} className="mt-4">
                  <p className="absolute">{user.name}</p>
                  <div className="mt-7 flex space-x-2">
                    {user.books.map((book) => (
                      <div
                        key={book.id}
                        className="relative h-8 w-[272px] cursor-pointer overflow-hidden bg-blue-500 pl-1 text-white"
                        onClick={() => setSelectedBook(book)}
                      >
                        <p className="pointer-events-none relative z-20">
                          <span className="font-bold">{book.title}</span> by{" "}
                          {book.author}
                        </p>
                        {book.image && (
                          <img
                            src={book.image}
                            alt=""
                            className="absolute top-0 left-0 z-10 h-full w-full object-cover opacity-10 transition-transform duration-300 hover:scale-125"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </main>
      </div>
    </>
  );
};

export const getServerSideProps = () => {
  return {
    props: {
      dayOfYear: getDayOfYear(new Date()),
    },
  };
};

export default Home;
