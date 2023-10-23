import style from "../styles/Profile.module.scss";
import historyStyles from "../styles/staff/BookingLog.module.scss";
import UserProfileStats from "@/components/UserProfileStats";
import Sidebar from "@/components/SlideBar";
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
    login: string;
    profilePicture: string;
  };
  requestDate: string;
  dayReturned: string;
  dateReturned: string;
  isRejected: boolean;
  isConfirmed: boolean;
  isReturned: boolean;
}

const HistoryCard: React.FC<{
  bookingHistory: BookingHistory;
  isReturnCard: Boolean;
}> = ({ bookingHistory, isReturnCard }) => {
  const gridTemplateColumns = isReturnCard
    ? "repeat(5, 1fr)"
    : "repeat(4, 1fr)";

  const gridStyle = {
    gridTemplateColumns: gridTemplateColumns,
  };

  return (
    <div className={historyStyles["log-card"]} style={gridStyle}>
      <div className={historyStyles["user-info"]}>
        <img
          src={bookingHistory.userInfo.profilePicture}
          alt={bookingHistory.userInfo.login}
        />
        <p>{bookingHistory.userInfo.login}</p>
      </div>
      <div className={historyStyles["books-info"]}>
        <p>{bookingHistory.bookInfo.bookName}</p>
        <button>View Book</button>
      </div>
      <p>{bookingHistory.requestDate}</p>
      <p>{bookingHistory.dayReturned}</p>
      {isReturnCard && (
        <p>{bookingHistory.isReturned ? bookingHistory.dayReturned : ""}</p>
      )}
    </div>
  );
};

const HistoryCardHeader = (props: any) => {
  const { isReturnCard } = props;
  const gridTemplateColumns = isReturnCard
    ? "repeat(5, 1fr)"
    : "repeat(4, 1fr)";

  const gridStyle = {
    gridTemplateColumns: gridTemplateColumns,
  };

  return (
    <div className={historyStyles["list-header"]} style={gridStyle!}>
      <p>User</p>
      <p>Book</p>
      <p>Pickup Date</p>
      <p>Supposed Return Date</p>
      {isReturnCard && <p>Day Returned</p>}
    </div>
  );
};

const calculateUserStats = (userHistory: BookingHistory[]) => {
  let returned = 0;
  let confirmed = 0;

  userHistory.forEach((bookReq) => {
    if (bookReq.isReturned) {
      returned++;
    } else if (bookReq.isConfirmed) {
      confirmed++;
    }
  });

  const stats = {
    returned,
    confirmed,
    pending: userHistory.length - (confirmed + returned),
  };

  return stats;
};

interface Props {
  userHistory: BookingHistory[];
  userStats: {
    returned: number;
    confirmed: number;
    pending: number;
  };
}
export default function Profile({ userHistory, userStats }: Props) {
  return (
    <div className="flex">
      <Sidebar />
      <div className={style["main-profile"]}>
        <UserProfileStats {...userStats} />
        <div className={style["data"]}>
          <h2>Pending Reservations</h2>
          <div className={historyStyles["bookings-main"]}>
            <div className={historyStyles["bookings-container"]}>
              {userStats?.pending ? (
                <>
                  <HistoryCardHeader isReturnCard={false} />
                  <div className={historyStyles["list"]}>
                    {userHistory?.map((bookReq) =>
                      bookReq.isConfirmed ? (
                        ""
                      ) : (
                        <HistoryCard
                          key={bookReq.bookInfo?.bookId}
                          bookingHistory={bookReq}
                          isReturnCard={false}
                        />
                      )
                    )}
                  </div>
                </>
              ) : (
                "No Pending Books Yet"
              )}
            </div>
          </div>
        </div>
        <div className={style["data"]}>
          <h2>Ongoing Reservations</h2>
          <div className={historyStyles["bookings-main"]}>
            <div className={historyStyles["bookings-container"]}>
              {userStats?.confirmed ? (
                <>
                  <HistoryCardHeader isReturnCard={false} />
                  <div className={historyStyles["list"]}>
                    {userHistory?.map((bookReq) =>
                      bookReq.isConfirmed && !bookReq.isReturned ? (
                        <HistoryCard
                          key={bookReq.bookInfo?.bookId}
                          bookingHistory={bookReq}
                          isReturnCard={false}
                        />
                      ) : (
                        ""
                      )
                    )}
                  </div>
                </>
              ) : (
                "No Ongoing Books Yet"
              )}
            </div>
          </div>
        </div>
        <div className={style["data"]}>
          <h2>Returned Books</h2>
          <div className={historyStyles["bookings-main"]}>
            <div className={historyStyles["bookings-container"]}>
              {userStats?.returned ? (
                <>
                  <HistoryCardHeader isReturnCard={true} />
                  <div className={historyStyles["list"]}>
                    {userHistory?.map((bookReq) =>
                      bookReq.isReturned ? (
                        <HistoryCard
                          key={bookReq.bookInfo?.bookId}
                          bookingHistory={bookReq}
                          isReturnCard={true}
                        />
                      ) : (
                        ""
                      )
                    )}
                  </div>
                </>
              ) : (
                "No Returned Books Yet"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const response = await axios.get(`${process.env.backendUrl}/userprofile`, {
      withCredentials: true,
      headers: {
        cookie: context.req.headers.cookie,
      },
    });

    if (response.status === 200) {
      const userHistory = response.data;
      const userStats = calculateUserStats(userHistory);

      return {
        props: {
          userHistory,
          userStats,
        },
      };
    } else {
      return {
        notFound: true,
      };
    }
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
