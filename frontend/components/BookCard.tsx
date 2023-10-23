import style from "../styles/components/BookCard.module.scss";
import { useState } from "react";
import { BiStar, BiCollection, BiBookAdd } from "react-icons/bi";
import Modal from "react-modal";
import DateRangePicker from "../components/DateRangePicker";
import axios from "axios";
import { useRouter } from "next/router";

interface Book {
  _id: string;
  bookName: string;
  author: string;
  bookCover: string;
  quantity: number;
  summary: string;
  category: [string];
}

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const {
    _id,
    bookName,
    author,
    bookCover,
    quantity,
    summary,
    category,
  } = book;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();
  const [rules, setRules] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const sendBookingRequest = async () => {
    if (!endDate)
      return alert("Please select a date range for your booking request.");

    if (!isChecked)
      return alert(
        "Please carefully read the rules before sending a booking request."
      );

    if (!startDate)
      return alert("Please select a date range for your booking request.");

    if (book.quantity === 0)
      return alert("Sorry, there are no copies available for this book.");

    try {
      const response = await axios.post(
        `${process.env.backendUrl}/requestbook`,
        {
          bookId: _id,
          returnDate: endDate,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        router.reload();
      }
    } catch (error) {}
  };

  return (
    <div className={style["book-card"]}>
      <div className={style["card-front"]} onClick={openModal}>
        <div className={style["rating"]}>
          <p>0</p>
          <BiStar />
        </div>
        <img
          src={bookCover}
          alt={`${bookName} Cover`}
          className=" w-100 h-[350px] object-cover object-center rounded-[.8rem] shadow-md z-[2] 

          "
        />
        <img
          src={bookCover}
          alt={`${bookName} Cover`}
          className=" z-[1] scale-[1.03] absolute top-0 left-0 w-100 h-[350px] blur-[.8rem]
        "
        />
        <h3
          className=" font-semibold mt-3 text-gray-700 text-left text-l w-[95%] 
        "
        >
          {bookName}
        </h3>
        <p
          className=" font-semibold  text-gray-400 text-left  w-[95%] text-sm mt-1
        "
        >
          {author}
        </p>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Book Modal"
        ariaHideApp={false}
        className={style["book-modal"]}
        overlayClassName={style["modal-overlay"]}
      >
        <div className={style["left"]}>
          <img src={bookCover} alt={`${bookName} Cover`} className="z-[2]" />
          <img src={bookCover} className="blur-[1rem] z-1 fixed top-8" />
          <h3>{bookName}</h3>
          <div className={style["line"]} />
          {quantity === 0 ? (
            <p
              className=" flex items-center gap-[.5rem] text-white bg-red-500 p-[.5rem] rounded-md
            "
            >
              <BiCollection className="text-xl" /> No Copies Available
            </p>
          ) : !isChecked ? (
            <p className={style["available"]}>
              <BiCollection /> {quantity} {quantity === 1 ? "Copy" : "Copies"}{" "}
              Available
            </p>
          ) : (
            <button
              className={style["booking-buttom"]}
              onClick={() => sendBookingRequest()}
            >
              <BiBookAdd /> Book
            </button>
          )}
        </div>
        <div className={style["right"]}>
          <div className={style["category"]}>
            <div className={style["tags"]}>
              {category.map((category) => (
                <p key={category}>{category}</p>
              ))}
            </div>
          </div>
          <div className={style["line"]} />
          <div className={style["description"]}>
            <h3>Summary</h3>
            <p>{summary}</p>
          </div>
          <div className={style["line"]} style={{ marginBottom: "px" }} />
          {rules ? (
            <div className={style["rules"]}>
              <h3>Rules</h3>

              <p>
                - Maximum period of booking is 10days. <br />
                - Please don't damage the book. <br />
                - You can only book 2 books at a time. (too lazy to code it){" "}
                <br />
                - Make sure to return the book on time. <br />
                - Once a Staff member approves your request, you can go to
                bocal to get the book. <br />
              </p>
              <button
                className={style["booking-buttom"]}
                onClick={() => setRules(false)}
              >
                🤲 I've read the rules
              </button>
            </div>
          ) : (
            <div className={style["pre-book"]}>
              <h3>Select Booking Period</h3>
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
              />
              <div className={style["check-rules"]}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <p>
                  I read the <span onClick={() => setRules(true)}>RULES</span>{" "}
                  and I agree.
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default BookCard;
