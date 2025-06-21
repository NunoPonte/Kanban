import { useState } from "react";
import styles from "./navbar.module.css";
import Image from "next/image";
import { useEffect } from "react";

export default function Navbar() {
  const [isFrame1, setIsFrame1] = useState(false);
  useEffect(() => {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    setIsFrame1(!prefersDarkScheme.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsFrame1(e.matches);
    };

    prefersDarkScheme.addEventListener("change", handleChange);

    return () => {
      prefersDarkScheme.removeEventListener("change", handleChange);
    };
  }, []);
  return (
    <div className={styles.switchDiv}>
      <Image
        src={isFrame1 ? "/webincode0.svg" : "/webincode1.svg"}
        alt="Logo"
        width={180}
        height={75}
        className={styles.logo}
      />
      <button
        className={styles.themeSwitch}
        onClick={() => {
          setIsFrame1((prev) => !prev);
          document.documentElement.style.setProperty(
            "--background",
            isFrame1 ? "#141414" : "#F5F5F5"
          );
          document.documentElement.style.setProperty(
            "--foreground",
            isFrame1 ? "#F5F5F5" : "#141414"
          );
        }}
      >
        <Image
          src={isFrame1 ? "/theme_switch0.svg" : "/theme_switch1.svg"}
          alt="Theme Switch"
          width={75}
          height={75}
        />
      </button>
    </div>
  );
}
