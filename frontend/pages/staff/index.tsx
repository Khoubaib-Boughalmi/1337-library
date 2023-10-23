import style from "../../styles/staff/Staff.module.scss";
import SideBar from "@/components/SlideBar";
import axios from "axios";
import { GetServerSideProps } from "next";

export default function Staff() {
  return (
    <div className="flex">
      <SideBar />
      <div className={style["staff-main"]}>
        <div className={style["header"]}>
          <h1>Booking Stats</h1>
        </div>
        <div className={style["line"]} />
        <div className={style["photo"]}>
          <h1>ستكون الاحصائيات متاحة قريبا انشاء الله انتظرونا</h1>
          <img
            src="https://i.postimg.cc/dtS8Dwqz/376406658-6504479626307976-7847415166923333140-n.jpg"
            alt="book cover"
          />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const resp = await axios.get(`${process.env.backendUrl}/myProfile`, {
      withCredentials: true,
      headers: {
        cookie: context.req.headers.cookie,
      },
    });
    if (resp.data.state !== "staff") {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return {
      props: {},
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
