import style from "../styles/Home.module.scss";
import { useEffect, useState } from "react"; // Import useState
import { BiBookOpen } from "react-icons/bi";
import SlideBar from "@/components/SlideBar";
import BookCard from "@/components/BookCard";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

interface Book {
  _id: string;
  bookName: string;
  bookISBN: string;
  category: [string];
  quantity: number;
  summary: string;
  owner: string;
  bookCover: string;
  author: string;
}

interface Props {
  books: Book[];
}

export default function Home({ books }: Props) {
  const router = useRouter();

  if (router.query.category) {
    useEffect(() => {}, [router.query?.category]);
  }

  return (
    <div className="flex">
      <SlideBar />
      <div className={style["main"]}>
        <div className={style["available-books"]}>
          <BiBookOpen />
          <h2>Available Books In Library</h2>
        </div>
        <div className={style["line"]} />

        {books ? (
          <div className={style["books-list"]}>
            {books.map((book) =>
              router.query?.category ? (
                book.category.includes(router.query.category as string) ? (
                  <BookCard key={book._id} book={book} />
                ) : (
                  ""
                )
              ) : (
                <BookCard key={book._id} book={book} />
              )
            )}
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  try {
    const response = await axios.get(`${process.env.backendUrl}/`, {
      withCredentials: true,
      headers: {
        cookie: context.req.headers.cookie,
      },
    });

    const books = response.data;
    return {
      props: {
        books,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
