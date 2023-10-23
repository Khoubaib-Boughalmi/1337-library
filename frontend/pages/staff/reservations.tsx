import style from "../../styles/staff/Reservations.module.scss";
import SideBar from "@/components/SlideBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import { GetServerSideProps } from "next";

interface Reservation {
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

interface ReservationCardProps {
  reservation: Reservation;
  onGoing: boolean;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  onGoing,
  reservation,
}) => {
  const { _id, bookInfo, userInfo, requestDate, returningDay } = reservation;
  const router = useRouter();
  const acceptReservation = async () => {
    try {
      const resp = await axios.post(
        `${process.env.backendUrl}/acceptRequest`,
        {
          RequestId: _id,
        },
        { withCredentials: true }
      );
      if (resp.status === 200) {
        router.reload();
      }
    } catch (error) {}
  };

  const rejectReservation = async () => {
    try {
      const resp = await axios.post(
        `${process.env.backendUrl}/rejectRequest`,
        {
          RequestId: _id,
        },
        { withCredentials: true }
      );
      if (resp.status === 200) {
        router.reload();
      }
    } catch (error) {}
  };

  const bookReturned = async () => {
    try {
      const resp = await axios.post(
        `${process.env.backendUrl}/bookReturned`,
        {
          RequestId: _id,
        },
        { withCredentials: true }
      );
      if (resp.status === 200) {
        router.reload();
      }
    } catch (error) {}
  };

  return (
    <div className={style["reservation-card"]}>
      <div className={style["user-info"]}>
        <img src={`${userInfo.profilePicture}`} />
        <p>{userInfo.login}</p>
      </div>
      <div className={style["books-info"]}>
        <p>{bookInfo.bookName}</p>
        <button>View Book</button>
      </div>
      <p>{requestDate}</p>
      <p>{returningDay}</p>
      <p>1337-Tetouan</p>
      {onGoing ? (
        <div className={style["reservation-actions"]}>
          <button className={style.accept} onClick={bookReturned}>
            Returned
          </button>
          <button className={style.ping}>Ping</button>
          <button className={style.decline}>TIG</button>
        </div>
      ) : (
        <div className={style["reservation-actions"]}>
          <button className={style.accept} onClick={acceptReservation}>
            Accept
          </button>
          <button className={style.decline} onClick={rejectReservation}>
            Decline
          </button>
        </div>
      )}
    </div>
  );
};

export default function Reservations({
  pendingReservations,
  ongoingReservations,
}: {
  pendingReservations: Reservation[];
  ongoingReservations: Reservation[];
}) {
  return (
    <div className="flex">
      <SideBar />
      <div className={style["reservations-main"]}>
        <h1>Pending Reservations</h1>
        <div className={style["line"]} />
        <div className={style["pending-reservations"]}>
          <div className={style["list-header"]}>
            <p>User</p>
            <p>Book</p>
            <p>Pickup Date</p>
            <p>Return Date</p>
            <p>Campus</p>
            <p>Actions</p>
          </div>
          <div className={style["list"]}>
            {pendingReservations.length === 0 ? (
              <p className={style["no-pending"]}>No Pending Reservations</p>
            ) : (
              pendingReservations?.map(
                (reservation: ReservationCardProps | any) => (
                  <ReservationCard
                    key={reservation?._id}
                    reservation={reservation}
                    onGoing={false}
                  />
                )
              )
            )}
          </div>
        </div>
        <h1>On-Going Reservations</h1>
        <div className={style["line"]} />
        <div className={style["pending-reservations"]}>
          <div className={style["list-header"]}>
            <p>User</p>
            <p>Book</p>
            <p>Pickup Date</p>
            <p>Return Date</p>
            <p>Campus</p>
            <p>Actions</p>
          </div>
          <div className={style["list"]}>
            {ongoingReservations.length === 0 ? (
              <p className={style["no-pending"]}>No On-Going Reservations</p>
            ) : (
              ongoingReservations?.map(
                (reservation: ReservationCardProps | any) => (
                  <ReservationCard
                    key={reservation?._id}
                    onGoing={true}
                    reservation={reservation}
                  />
                )
               )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const resp = await axios.get(`${process.env.backendUrl}/reservations`, {
      withCredentials: true,
      headers: {
        cookie: context.req.headers.cookie,
      },
    });

    if (resp.status === 200) {
      const { PendingRequests, OngoingRequests } = resp.data;
      return {
        props: {
          pendingReservations: PendingRequests,
          ongoingReservations: OngoingRequests,
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
