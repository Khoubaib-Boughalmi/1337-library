import style from "../../styles/staff/BookingLog.module.scss";
import SideBar from "@/components/SlideBar";
import axios from "axios";
import { GetServerSideProps } from "next";

interface BookingHistory {
  _id: string;
  bookInfo: {
    bookId: string;
    bookName: string;
    bookISBN: string;
  };
  userInfo: {
    userId: string;
    login: string;
    profilePicture: string;
  };
  requestDate: string;
  returningDay: string;
  dateReturned: string;
  isRejected: boolean;
  isConfirmed: boolean;
  note: string;
}

const LogsCard: React.FC<{ bookingHistory: BookingHistory }> = ({
  bookingHistory,
}) => {
  return (
    <div className={style["log-card"]}>
      <div className={style["user-info"]}>
        <img
          src={bookingHistory.userInfo.profilePicture}
          alt={bookingHistory.userInfo.login}
        />
        <p>{bookingHistory.userInfo.login}</p>
      </div>
      <div className={style["books-info"]}>
        <p>{bookingHistory.bookInfo.bookName}</p>
        <button>View Book</button>
      </div>
      <p>{bookingHistory.requestDate}</p>
      <p>{bookingHistory.returningDay}</p>
      <p>{bookingHistory.dateReturned}</p>
      <p>{bookingHistory.note}</p>
    </div>
  );
};

export default function BookingLogs({ logs }: { logs: BookingHistory[] }) {
  return (
    <div className="flex">
      <SideBar />
      <div className={style["bookings-main"]}>
        <h1>Booking Log</h1>
        <div className={style["line"]} />
        <div className={style["bookings-container"]}>
          <div className={style["list-header"]}>
            <p>User</p>
            <p>Book</p>
            <p>Pickup Date</p>
            <p>Supposed Return Date</p>
            <p>Day Returned</p>
            <p>Note</p>
          </div>
          <div className={style["list"]}>
            {logs?.map((log) => (
              <LogsCard key={log._id} bookingHistory={log} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const resp = await axios.get(`${process.env.backendUrl}/bookingHistory`, {
      withCredentials: true,
      headers: {
        cookie: context.req.headers.cookie,
      },
    });

    const logs = resp.data.bookingHistory;

    return {
      props: {
        logs,
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
