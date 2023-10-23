import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import style from "../styles/components/AddBook.module.scss";

export interface BookData {
  bookName?: string;
  author?: string;
  bookISBN?: string;
  owner?: string;
  summary?: string;
  category?: string[];
  bookCover?: string;
  quantity?: number;
  _id?: string;
}

const categories = [
  "Data science",
  "Web dev",
  "Mobile dev",
  "AI / Machine Learning",
  "Computer science",
  "Computer graphics",
  "Algorithms",
  "Networking",
  "Operating systems",
  "Cyber Security",
  "AR / VR",
  "Game dev",
  "Programming languages",
  "Design patterns",
  "Code quality",
  "Linux / Unix",
  "Robotics / Hardware",
  "software engineering",
  "other",
  "DevOps",
];

export default function AddBook({
  bookData = {},
  editBookData,
}: {
  bookData?: BookData;
  editBookData?: boolean;
}) {
  const router = useRouter();
  const [bookFormData, setBookFormData] = useState<BookData>({
    ...bookData,
    category: bookData?.category || [],
  });

  const handleChange = async (e: any) => {
    let { name, value } = e.target;

    setBookFormData({
      ...bookFormData,
      [name]: value,
    });
  };

  const submitBookData = async (e: any) => {
    const url = editBookData
      ? `${process.env.backendUrl}/updateBook/${bookData?._id}`
      : `${process.env.backendUrl}/addNewBook`;
    if (!Object.values(bookFormData).every((value) => value !== "")) {
      e.preventDefault();
      alert("Please fill all the fields");
      return;
    }

    try {
      const res = await axios.post(url, bookFormData, {
        withCredentials: true,
      });

      if (res.status === (editBookData ? 200 : 201)) {
        router.reload();
      }
    } catch (error) {
      router.reload();
    }
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    category: string // Add the category argument here
  ) => {
    const { checked } = event.target;

    if (checked) {
      setBookFormData({
        ...bookFormData,
        category: [...(bookFormData.category || []), category], // Use the category argument
      });
    } else {
      setBookFormData({
        ...bookFormData,
        category: (bookFormData.category || []).filter(
          (existingCategory) => existingCategory !== category
        ),
      });
    }
  };

  return (
    <>
      <div className={style["add-book-box"]}>
        <h1>{editBookData ? "Edit Book" : "Add Book"}</h1>
        <form
          className={style["form"]}
          onSubmit={(e) => {
            submitBookData(e);
          }}
        >
          <div className={style["left-add-book"]}>
            <div className={style["input-area"]}>
              <label htmlFor="bookName">Book Name</label>
              <input
                type="text"
                name="bookName"
                placeholder="Book Name"
                value={bookFormData.bookName}
                onChange={handleChange}
              />
            </div>
            <div className={style["input-area"]}>
              <label htmlFor="author">Author Name</label>
              <input
                type="text"
                name="author"
                placeholder="Author Name"
                value={bookFormData.author}
                onChange={handleChange}
              />
            </div>
            <div className={style["input-area"]}>
              <label htmlFor="bookISBN">ISBN</label>
              <input
                type="text"
                name="bookISBN"
                placeholder="ISBN"
                value={bookFormData.bookISBN}
                onChange={handleChange}
              />
            </div>
            <div className={style["input-area"]}>
              <label htmlFor="owner">Book Owner</label>
              <input
                type="text"
                name="owner"
                placeholder="Owner"
                value={bookFormData.owner}
                onChange={handleChange}
              />
            </div>
            <label htmlFor="category">Category</label>
            <div className={style["category-input"]}>
              <div className={style["checkbox-group"]}>
                {categories.map((category) => (
                  <label key={category} className={style["checkbox-label"]}>
                    <input
                      type="checkbox"
                      name="category"
                      value={category}
                      checked={bookFormData?.category?.includes(category)}
                      onChange={(event) =>
                        handleCategoryChange(event, category)
                      }
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit">Add Book</button>
          </div>
          <div className={style["line"]} />
          <div className={style["right-add-book"]}>
            <div className={style["input-area"]}>
              <label htmlFor="summary">Book Summary</label>
              <textarea
                name="summary"
                id="summary"
                placeholder="Description"
                value={bookFormData.summary}
                onChange={handleChange}
              />
            </div>
            <div className={style["book-cover-upload"]}>
              <div className={style["cover-area"]}>
                <img src={bookFormData.bookCover} alt="Book Cover" />
              </div>
              <div className={style["input-stack"]}>
                <div className={style["input-area"]}>
                  <label htmlFor="bookCover">Upload Book Cover</label>
                  <input
                    type="text"
                    name="bookCover"
                    id="bookCover"
                    value={bookFormData.bookCover}
                    onChange={handleChange}
                  />
                </div>
                <div className={style["input-area"]}>
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={bookFormData.quantity}
                    onChange={handleChange}
                    id="quantity"
                    min="1"
                  />
                </div>
              </div>
            </div>
            <div className={style["selected-categ"]}>
              <label>Selected Book Categories</label>
              <div className={style["selected-categories"]}>
                {bookFormData?.category?.map((category) => (
                  <p key={category}>{category}</p>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
