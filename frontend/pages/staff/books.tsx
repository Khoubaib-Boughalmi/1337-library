import React, { useState } from "react";
import style from "../../styles/staff/Books.module.scss";
import AddBook from "@/components/AddBook";
import Modal from "react-modal";
import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import SideBar from "@/components/SlideBar";
import { GetServerSideProps } from "next";

interface Book {
  _id: string;
  bookName: string;
  bookISBN: string;
  author: string;
  category: [string];
  quantity: number;
  summary: string;
  owner: string;
  bookCover: string;
  bookCampus: number;
}

const BooksCard: React.FC<{ book: Book }> = ({ book }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteBook = async () => {
    try {
      const resp = await axios.delete(
        `${process.env.backendUrl}/deletebook/${book._id}`,
        {
          withCredentials: true,
        }
      );
      if (resp.status == 200) {
        router.reload();
      }
    } catch (error) {
    }
  };

  return (
    <div className={style["book-card"]}>
      <div className={style["book-front"]}>
        <img src={book.bookCover} alt={book.bookName} />
      </div>
      <div className={style["book-back"]}>
        <div className={style["book-info"]}>
          <p>{book.bookName}</p>
          <p>Author: {book.author}</p>
          <p>ISBN: {book.bookISBN}</p>
          <p>Campus: {book.bookCampus}</p>
          <p>Quantity: {book.quantity}</p>
          <p>Owner: {book.owner}</p>
        </div>
        <div className={style["book-actions"]}>
          <button onClick={handleEditClick}>Edit</button>
          <button onClick={handleDeleteBook}>Delete</button>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        className=" z-[100] rounded-md overflow-hidden"
        overlayClassName={
          "fixed inset-0 bg-black bg-opacity-50 z-[100] backdrop-filter backdrop-blur-sm"
        }
      >
        <AddBook bookData={book} editBookData={true} />
      </Modal>
    </div>
  );
};

export default function Books({ books }: { books: Book[] }) {
  return (
    <div className="flex">
      <SideBar />
      <div className={style["bookings-main"]}>
        <div>
          <h1>Books List</h1>
          <div className={style["line"]} />
          <div className={style["list"]}>
            {books.map((book) => (
              <BooksCard key={book._id} book={book} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const pro = await axios.get(`${process.env.backendUrl}/myprofile`, {
      withCredentials: true,
      headers: {
        cookie: context.req.headers.cookie,
      },
    });
    if (pro.data.state !== "staff") {
      throw new Error("Not authorized");
    }

    const resp = await axios.get(`${process.env.backendUrl}/`, {
      withCredentials: true,
      headers: {
        cookie: context.req.headers.cookie,
      },
    });

    return {
      props: {
        books: resp.data,
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
