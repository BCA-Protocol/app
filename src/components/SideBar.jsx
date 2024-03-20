import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "/public/logo.png";
import { useSignOut } from "react-firebase-hooks/auth";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { auth } from "@/firebase";

const menuItems = [
  {
    href: "/dashboard",
    title: "Dashboard",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        fill="currentColor"
        className="mr-4 text-lg"
        viewBox="0 0 16 16"
      >
        <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-3.5-7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z" />
      </svg>
    ),
  },
  {
    href: "/leaderboard",
    title: "Leaderboard",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        fill="currentColor"
        className="mr-4 text-lg"
        viewBox="0 0 16 16"
      >
        <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zm-3.5-7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z" />
      </svg>
    ),
  },
];

export default function SideBar({ currentPath }) {
  const [signOut] = useSignOut(auth);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div>
      <MenuIcon
        className="absolute w-10 h-10 border left-2 top-2 border-borderprimary text-secondaryx"
        onClick={toggleSidebar}
      />
      <aside
        className={`fixed inset-y-0 left-0 bg-bgSidebar shadow-md w-60 z-40  ${
          sidebarVisible ? "" : "hidden"
        } lg:block`}
      >
        <div className="flex flex-col justify-between h-full">
          <CloseIcon
            onClick={toggleSidebar}
            className="absolute top-0 right-0 z-40 w-10 h-10 border cursor-pointer ml-28 border-borderprimary text-secondaryx lg:hidden "
          />

          <div className="flex-grow">
            <div className="flex items-center justify-center w-full mt-2 mb-8">
              <Image src={logo} alt="Logo" width={200} height={200} />
            </div>

            <div className="p-4">
              <ul className="space-y-1">
                {menuItems &&
                  menuItems.length > 0 &&
                  menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className={`${
                          currentPath === item.href ? "bg-tabs" : ""
                        } flex items-center rounded-xl font-bold text-sm text-secondaryx py-3 px-4 border border-borderprimary`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          fill="currentColor"
                          className="mr-4 text-lg"
                          viewBox="0 0 16 16"
                        >
                          <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-3.5-7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z" />
                        </svg>
                        {item.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div
            className="p-2 border cursor-pointer border-borderprimary rounded-xl bg-bgcard text-secondaryx"
            onClick={signOut}
          >
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 text-sm font-semibold transition h-9 rounded-xl bg-prim hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2em"
                height="2em"
                fill="currentColor"
                className=""
                viewBox="0 0 16 16"
              >
                <path d="M12 1a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2a1 1 0 0 1 1-1h8zm-2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
              </svg>
            </button>{" "}
            <span className="ml-2 text-sm font-bold">Logout</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
