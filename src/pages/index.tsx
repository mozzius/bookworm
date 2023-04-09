/* eslint-disable @next/next/no-img-element */
import { type InferGetServerSidePropsType, type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { getDayOfYear } from "date-fns";
import { Plus } from "lucide-react";

import { api } from "@/utils/api";
import { NamePrompt } from "@/components/name-prompt";
import { AddBookPopup } from "@/components/add-book-popup";
import { BookCard } from "@/components/book-card";
import { cx } from "@/utils/classes";

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

  const authed = session.status === "authenticated";

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
      <div className="flex min-h-screen flex-col">
        <header className="flex h-20 w-full grow-0 items-center justify-between px-8">
          <h1
            className={cx(
              "text-4xl font-medium",
              authed && "hidden sm:inline-block"
            )}
          >
            52 Books
          </h1>
          {authed ? (
            <>
              <button
                onClick={() => setAddBookPopupOpen(true)}
                className="flex shrink-0 items-center gap-2 rounded-sm bg-blue-500 py-2 px-4 text-white shadow"
              >
                <Plus /> Add book
              </button>
              <button
                onClick={() => void signOut()}
                className="whitespace-nowrap rounded-sm border px-4 py-2"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => void signIn()}
              className="whitespace-nowrap rounded-sm border px-4 py-2"
            >
              Sign in
            </button>
          )}
        </header>
        <main className="flex flex-1 flex-col items-center justify-center">
          <div className="flex w-full flex-1 flex-col overflow-x-scroll px-8">
            <div className="relative flex space-x-2 pt-8">
              {days.map((day) => (
                <div key={day.getTime()}>
                  {day.getDate() === 1 && (
                    <p className="absolute top-0">
                      {day.toLocaleString("default", { month: "long" })}
                    </p>
                  )}
                  <div className="h-8 w-8 rounded-sm bg-slate-200 pl-1">
                    {day.getDate()}
                  </div>
                </div>
              ))}
            </div>
            <div
              className="mt-2 h-8 rounded-sm bg-red-500"
              style={{ width: (32 + 8) * dayOfYear - 8 - 16 }}
            />
            {users.data &&
              users.data.map((user, i) => {
                let prize = null;
                switch (i) {
                  case 0:
                    prize = "🥇";
                    break;
                  case 1:
                    prize = "🥈";
                    break;
                  case 2:
                    prize = "🥉";
                    break;
                }
                return (
                  <div key={user.id} className="mt-4">
                    <p className="absolute">
                      {prize} {user.name}
                    </p>
                    <div className="mt-7 flex space-x-2">
                      {user.books.map((book) => (
                        <BookCard key={book.id} book={book} />
                      ))}
                    </div>
                  </div>
                );
              })}
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
