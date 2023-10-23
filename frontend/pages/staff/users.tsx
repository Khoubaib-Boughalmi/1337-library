import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import SlideBar from "@/components/SlideBar";
import { GetServerSideProps } from "next";

interface User {
  _id: string;
  login: string;
  profilePicture: string;
  state: string;
  campusId: Number;
  isBanned: boolean;
}

export default function users({ users }: { users: User[] }) {
  const router = useRouter();
  return (
    <div className="flex">
      <SlideBar />
      <div className="flex flex-col m-[2rem] w-full">
        <h2
          className="font-bold text-2xl
        "
        >
          Your Campus Users
        </h2>
        <div className="w-full h-[.2rem] bg-black my-[1rem] rounded-md" />
        <div className="flex flex-wrap gap-[.5rem]">
          {users?.map((user: User) => (
            <div
              key={user._id}
              className={`flex flex-col items-center p-[1rem] rounded-md drop-shadow-xl m-[1rem] gap-[1rem]  hover:scale-[1.02]
              transition-all duration-300
               ${user.state === "staff" ? "bg-black text-white " : "bg-white"}`}
            >
              <img
                src={user.profilePicture}
                alt={user.login}
                className="w-[10rem] h-[10rem] rounded-full hover:border-[4px] hover:border-green-500
                 transition-all duration-300 cursor-pointer"
              />
              <p className="font-bold text-xl">{user.login}</p>
              <button
                className={`flex items-center justify-center p-[.5rem] rounded-md w-[80%] text-white shadow-md hover:w-[90%]
                 transition-all duration-300
                 ${
                   user.isBanned
                     ? "bg-red-500 hover:bg-green-600"
                     : "bg-green-500 hover:bg-red-600"
                 }`}
                onClick={() => {
                  const banUser = async () => {
                    try {
                      const resp = await axios.post(
                        `${process.env.backendUrl}/banHandler/`,
                        {
                          userId: user._id,
                          isBanned: !user.isBanned,
                        },
                        {
                          withCredentials: true,
                        }
                      );
                      if (resp.status === 200) {
                        router.reload();
                      }
                    } catch (error) {}
                  };
                  banUser();
                }}
              >
                {user.isBanned ? "Unban" : "Ban"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const resp = await axios.get(`${process.env.backendUrl}/getusers`, {
      withCredentials: true,
      headers: {
        cookie: context.req.headers.cookie,
      },
    });

    if (resp.status === 200) {
      const users = resp.data;
      return {
        props: {
          users,
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
