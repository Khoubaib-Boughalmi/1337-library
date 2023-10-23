import React from "react";
import style from "../styles/Profile.module.scss";
import { FaBook, FaUndo, FaGift,FaCheck } from "react-icons/fa";

interface UserProfileStatsProps {
  returned: number;
  confirmed: number;
  pending: number;
}

const iconColors = {
  pending: "blue",
  confirmed: "green",
  returned: "green",
  donated: "red",
};

const StatsItem = ({
  icon,
  title,
  value,
}: {
  icon: JSX.Element;
  title: string;
  value: number;
}) => (
  <div className={style["stats__item"]}>
    {icon}
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

const UserProfileStats = ({
  returned,
  confirmed,
  pending,
}: UserProfileStatsProps) => {
  return (
    <div>
      <h1>Your Profile Stats</h1>
      <div className={style["stats"]}>
        <StatsItem
          icon={<FaBook size={48} color={iconColors.pending} />}
          title="Pending Books"
          value={pending | 0}
        />
        <StatsItem
          icon={<FaCheck size={48} color={iconColors.confirmed} />}
          title="Books Confirmed"
          value={confirmed | 0}
        />
        <StatsItem
          icon={<FaUndo size={48} color={iconColors.returned} />}
          title="Books Returned"
          value={returned | 0}
        />
        <StatsItem
          icon={<FaGift size={48} color={iconColors.donated} />}
          title="Books Donated"
          value={0}
        />
      </div>
    </div>
  );
};

export default UserProfileStats;
