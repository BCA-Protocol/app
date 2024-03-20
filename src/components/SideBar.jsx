import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "/public/logo.png";
import { useSignOut } from "react-firebase-hooks/auth";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { auth } from "@/firebase";
import {
  Squares2X2Icon,
  TrophyIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { classNames } from "@/utils/css-utils";

const menuItems = [
  {
    href: "/dashboard",
    title: "Dashboard",
    icon: Squares2X2Icon,
  },
  {
    href: "/leaderboard",
    title: "Leaderboard",
    icon: TrophyIcon,
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
      {/* <MenuIcon
        className="absolute w-10 h-10 border left-2 top-2 border-borderprimary text-secondaryx"
        onClick={toggleSidebar}
      /> */}
      <aside
        className={classNames(
          "fixed inset-y-0 left-0 bg-[#131313] shadow-md w-60 z-40 lg:block",
          sidebarVisible ? "" : "hidden"
        )}
      >
        <div className="flex flex-col justify-between h-full">
          {/* <CloseIcon
            onClick={toggleSidebar}
            className="absolute top-0 right-0 z-40 w-10 h-10 border cursor-pointer ml-28 border-borderprimary text-secondaryx lg:hidden "
          /> */}

          <div className="flex-grow">
            <div className="flex items-center justify-center w-full mt-8 mb-8">
              <Image src={logo} alt="Logo" width={200} height={200} />
            </div>

            <div className="p-4">
              <ul className="space-y-2">
                {menuItems &&
                  menuItems.length > 0 &&
                  menuItems.map((item, index) => {
                    const IconElement = item.icon || null;

                    return (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className={classNames(
                            currentPath === item.href ? "bg-purple-900" : "",
                            "group flex items-center rounded-xl font-semibold text-sm text-fuchsia-600 hover:text-fuchsia-400 py-3 px-4 hover:bg-purple-800 border-fuchsia-900 gap-x-2"
                          )}
                        >
                          {IconElement && (
                            <IconElement
                              className={classNames(
                                currentPath === item.href
                                  ? "bg-purple-900"
                                  : "",
                                "w-5 h-5 text-fuchsia-600 group-hover:text-fuchsia-400 shrink-0"
                              )}
                              aria-hidden="true"
                            />
                          )}
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
          <div className="w-full p-4 cursor-pointer border-[#272727] group">
            <button
              onClick={signOut}
              type="button"
              className="inline-flex items-center justify-start w-full px-4 py-3 space-x-3 text-base font-normal text-gray-500 transition cursor-pointer rounded-x-2 hover:text-fuchsia-600"
            >
              <ArrowRightOnRectangleIcon className="w-6 h-6 shrink-0" />
              <span>Logout</span>
            </button>{" "}
          </div>
        </div>
      </aside>
    </div>
  );
}
