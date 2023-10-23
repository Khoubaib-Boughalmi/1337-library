import styles from "../styles/Index.module.scss";
import { Si42 } from "react-icons/si";
import Link from "next/link";

export default function Index() {
  return (
    <div className={styles.main}>
      <div className={styles["login-box"]}>
        <img src="/logo.png" alt="logo" />
        <Link href={`${process.env.backendUrl}/auth/42`}>
          <p>Login With</p> <Si42 />
        </Link>
        <p
          className="text-center mt-3 text-gray-400 text-sm
        "
        >
          V1.0.0
        </p>
      </div>
      <p
        className="text-center mt-3 text-gray-300 text-sm absolute bottom-0 pb-2
        "
      >
        Le magnifique logo conçu par monsieur Yassine.
      </p>
    </div>
  );
}
