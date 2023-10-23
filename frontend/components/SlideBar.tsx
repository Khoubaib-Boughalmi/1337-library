import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import {
  BsArrowLeftShort,
  BsSearch,
  BsChevronDown,
  BsBook,
} from "react-icons/bs";
import { CiMenuKebab } from "react-icons/ci";
import { FiUsers } from "react-icons/fi";
import { ImBooks } from "react-icons/im";
import { RiDashboardFill, RiPagesFill } from "react-icons/ri";
import {
  AiFillSetting,
  AiOutlineLogout,
  AiOutlineFundProjectionScreen,
  AiOutlineHistory,
} from "react-icons/ai";
import {
  MdOutlinePermMedia,
  MdAnalytics,
  MdOutlineCategory,
} from "react-icons/md";
import AddBook from "./AddBook";

interface myProfile {
  state: string;
  login: string;
  profilePicture?: string;
}

interface MenuItem {
  index: Number;
  title: string;
  url?: string;
  icon?: JSX.Element;
  spacing?: boolean;
  submenu?: boolean;
  protected?: boolean;
  submenuItems?: SubmenuItem[];
}

interface SubmenuItem {
  title: string;
  url: string;
  subIcon?: JSX.Element;
}
const Menus: MenuItem[] = [
  { index: 0, title: "Home", url: "/home", protected: false },
  {
    index: 1,
    title: "Profile",
    icon: <RiPagesFill />,
    url: "/profile",
    protected: false,
  },
  {
    index: 2,
    title: "Categories",
    submenu: true,
    icon: <AiOutlineFundProjectionScreen />,
    protected: false,
    submenuItems: [
      { title: "All Books", subIcon: <MdOutlineCategory />, url: `` },
      {
        title: "Web dev",
        subIcon: <MdOutlineCategory />,
        url: `?category=Web dev`,
      },
      {
        title: "Mobile dev",
        subIcon: <MdOutlineCategory />,
        url: `?category=Mobile dev`,
      },
      {
        title: "AI / Machine Learning",
        subIcon: <MdOutlineCategory />,
        url: `?category=AI / Machine Learning`,
      },
      {
        title: "Computer science",
        subIcon: <MdOutlineCategory />,
        url: `?category=Computer science`,
      },
      {
        title: "Computer graphics",
        subIcon: <MdOutlineCategory />,
        url: `?category=Computer graphics`,
      },
      {
        title: "Algorithms",
        subIcon: <MdOutlineCategory />,
        url: `?category=Algorithms`,
      },
      {
        title: "Networking",
        subIcon: <MdOutlineCategory />,
        url: `?category=Networking`,
      },
      {
        title: "Operating systems",
        subIcon: <MdOutlineCategory />,
        url: `?category=Operating systems`,
      },
      {
        title: "Cyber Security",
        subIcon: <MdOutlineCategory />,
        url: `?category=Cyber Security`,
      },
      {
        title: "AR / VR",
        subIcon: <MdOutlineCategory />,
        url: `?category=AR / VR`,
      },
      {
        title: "Game dev",
        subIcon: <MdOutlineCategory />,
        url: `?category=Game dev`,
      },
      {
        title: "Programming languages",
        subIcon: <MdOutlineCategory />,
        url: `?category=Programming languages`,
      },
      {
        title: "Design patterns",
        subIcon: <MdOutlineCategory />,
        url: `?category=Design patterns`,
      },
      {
        title: "Code quality",
        subIcon: <MdOutlineCategory />,
        url: `?category=Code quality`,
      },
      {
        title: "Linux / Unix",
        subIcon: <MdOutlineCategory />,
        url: `?category=Linux / Unix`,
      },
      {
        title: "software engineering",
        subIcon: <MdOutlineCategory />,
        url: `?category=software engineering`,
      },
      {
        title: "Robotics / Hardware",
        subIcon: <MdOutlineCategory />,
        url: `?category=Robotics / Hardware`,
      },
      {
        title: "software engineering",
        subIcon: <MdOutlineCategory />,
        url: `?category=software engineering`,
      },
      {
        title: "DevOps",
        subIcon: <MdOutlineCategory />,
        url: `?category=DevOps`,
      },
      {
        title: "other",
        subIcon: <MdOutlineCategory />,
        url: `?category=other`,
      },
    ],
  },
  {
    index: 3,
    title: "Staff",
    icon: <AiFillSetting />,
    url: "/staff",
    protected: true,
    spacing: true,
  },
  {
    index: 4,
    title: "reservations",
    icon: <MdAnalytics />,
    url: "/staff/reservations",
    protected: true,
  },
  {
    index: 5,
    title: "Booking Log",
    icon: <AiOutlineHistory />,
    url: "/staff/booking-log",
    protected: true,
  },
  {
    index: 6,
    title: "Users",
    icon: <FiUsers />,
    url: "/staff/users",
    protected: true,
  },
  {
    index: 7,
    title: "Books",
    icon: <ImBooks />,
    url: "/staff/books",
    protected: true,
  },
];

const SlideBar: React.FC = ({ state }: any) => {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [myprofile, setMyProfile] = useState<myProfile>();
  const [isActive, setIsActive] = useState<Number>(0);

  const handleCategoryNavigation = (url: String) => {
    const query = url.split("=")[1];
    if (query) {
      router.push({
        pathname: "/home",
        query: { category: query },
      });
    } else {
      router.push({
        pathname: "/home",
      });
    }
  };

  const activeNav = (index: any) => {
    setIsActive(index);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const setActiveLinkFun = () => {
    const path = router.pathname;
    Menus.forEach((item) => {
      if (item.url == path) setIsActive(item.index);
    });
  };
  useEffect(() => {
    const getMyProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.backendUrl}/myprofile`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setMyProfile(response.data);
        }
      } catch (error) {
        router.push("/");
      }
    };
    getMyProfile();
    setActiveLinkFun();
  }, []);

  const StaffMenuItem = (menu: any) => {
    return (
      <div>
        <Link href={menu.url ? menu.url : ""}>
          <li
            key={menu.index}
            className={`text-white text-sm flex items-center
						gap-x-4 cursor-pointer p-2 hover:bg-green-700
						rounded-md ${menu.spacing ? "mt-9" : "mt-2"}
            ${menu.index == isActive ? "active" : ""}`}
            onClick={() => {
              if (menu.submenu) setSubmenuOpen(!submenuOpen);
              activeNav(menu.index);
            }}
          >
            <span className="text-2xl block float-left">
              {menu.icon ? menu.icon : <RiDashboardFill />}
            </span>
            <span
              className={`text-base font-medium flex-1
							duration-200 ${!open && "hidden"}`}
            >
              {menu.title}
            </span>
            {menu.submenu && (
              <BsChevronDown className={`${submenuOpen && "rotate-180"}`} />
            )}
          </li>
        </Link>
      </div>
    );
  };
  return (
    <div className="flex sticky h-screen top-0 left-0 duration-700">
      <div
        className={`bg-black h-screen p-5 pt-8 duration-200 ease-in ${
          open ? "w-60" : "w-20"
        } relative overflow-y-auto overflow-x-hidden flex flex-col justify-between`}
      >
        <div>
          <CiMenuKebab
            className={`text-white
            text-2xl rounded-full absolute bg-green top-10 cursor-pointer right-2 ${
              !open && "hidden"
            }`}
            onClick={() => {
              setOpen(!open);
            }}
          />
          <div
            className="inline-flex cursor-pointer"
            onClick={() => {
              setOpen(!open);
            }}
          >
            <img
              src="/logo.png"
              alt="logo"
              className="invert w-[11rem] flex-shrink-0 my-[-.5rem] "
            />
          </div>
          <div
            className={`flex items-center rounded-md border
              mt-1 px-4 py-2 ${!open && "hidden"}`}
          >
            <BsSearch
              className={`text-white text-lg block
                float-left cursor-pointer ${!open && "mr-2"} `}
            />
            <input
              type={"search"}
              placeholder="Search"
              className={`text-base bg-transparent px-3 w-full text-white
                focus:outline-none ${!open && "hidden"}`}
            />
          </div>
          <ul className="pt-2">
            {Menus.map((menu, index) => (
              <React.Fragment key={index}>
                {myprofile?.state == "staff" && <StaffMenuItem {...menu} />}
                {myprofile?.state != "staff" && !menu.protected && (
                  <Link href={menu.url ? menu.url : ""}>
                    <li
                      key={index}
                      className={`text-white text-sm flex items-center
                      gap-x-4 cursor-pointer p-2 hover:bg-green-700
                      rounded-md ${menu.spacing ? "mt-9" : "mt-2"} 
                      ${menu.index == isActive ? "active" : ""}`}
                      onClick={() => {
                        if (menu.submenu) setSubmenuOpen(!submenuOpen);
                        activeNav(menu.index);
                      }}
                    >
                      <span className="text-2xl block float-left">
                        {menu.icon ? menu.icon : <RiDashboardFill />}
                      </span>
                      <span
                        className={`text-base font-medium flex-1
											duration-200 ${!open && "hidden"}`}
                      >
                        {menu.title}
                      </span>
                      {menu.submenu && (
                        <BsChevronDown
                          className={`${submenuOpen && "rotate-180"}`}
                        />
                      )}
                    </li>
                  </Link>
                )}
                {menu.submenu && submenuOpen && open && (
                  <ul>
                    {menu.submenuItems?.map((submenuItem, index) => (
                      <li
                        key={index}
                        className="text-white
											text-sm flex items-center gap-x-4
											cursor-pointer p-2 px-5 hover:bg-green-700
											rounded-md"
                        onClick={() => {
                          handleCategoryNavigation(submenuItem.url);
                        }}
                      >
                        <span className="text-2xl block float-left">
                          {submenuItem.subIcon ? (
                            submenuItem.subIcon
                          ) : (
                            <RiDashboardFill />
                          )}
                        </span>
                        {submenuItem.title}
                      </li>
                    ))}
                  </ul>
                )}
              </React.Fragment>
            ))}
          </ul>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            className=" z-[100] rounded-md overflow-hidden"
            overlayClassName={
              "fixed inset-0 bg-black bg-opacity-50 z-[100] backdrop-filter backdrop-blur-sm"
            }
          >
            <AddBook editBookData={false} />
          </Modal>
          <button
            className={`py-2 px-5 w-full text-white font-medium bg-green-700 hover:bg-green-600 rounded-[.6rem] mt-5 ${
              !open && "hidden"
            }`}
            onClick={handleOpenModal}
          >
            {myprofile?.state == "staff" ? "Add Book" : "Donate Book"}
          </button>
        </div>
        {open ? (
          <div
            className={`flex border border-gray-700 pt-5 mt-[2rem] flex-col items-center justify-center p-[1rem] gap-y-4 rounded-[1rem] 
            `}
          >
            <Link href="/profile">
              <img
                src={myprofile?.profilePicture}
                alt="profile"
                className="w-[4rem] h-[4rem] rounded-full border-[1px]  mt-[-3rem]
                  "
              />
              <h1 className="text-gray-500 text-sm font-medium cursor-pointer text-center">
                {myprofile?.login}
              </h1>
            </Link>
            <Link href={`${process.env.backendUrl}/logout`}>
              <div
                className="flex w-full items-center gap-x-3 bg-red-600 border px-[2rem] py-[.2rem] rounded-[.5rem] cursor-pointer hover:bg-red-500 hover:scale-[1.04] ease-in duration-200
              "
              >
                <AiOutlineLogout
                  className="text-white text-2xl cursor-pointer p-1 text-[1.8rem]
                    "
                />
                <h1 className="text-white text-sm font-medium cursor-pointer">
                  Logout
                </h1>
              </div>
            </Link>
          </div>
        ) : (
          <Link href="/profile">
            <img
              src={myprofile?.profilePicture}
              alt="profile"
              className="w-11 h-11 rounded-full border-[1px]
          "
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default SlideBar;
