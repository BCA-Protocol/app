import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "/public/bca-left.png";
import mascotHappy from "/public/m/4-small.png";
import mascotLove from "/public/m/8-small.png";

import { useSignOut } from "react-firebase-hooks/auth";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { auth } from "@/firebase";
import {
  Squares2X2Icon,
  TrophyIcon,
  ArrowRightOnRectangleIcon,
  RocketLaunchIcon,
  BookOpenIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { classNames } from "@/utils/css-utils";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    href: "/dashboard",
    title: "Dashboard",
    icon: Squares2X2Icon,
  },
  {
    href: "/leaderboard",
    title: "Referral Program",
    icon: TrophyIcon,
  },
  {
    href: "/quest",
    title: "Quest",
    icon: RocketLaunchIcon,
  },
];

export default function SideBar({ currentPath }) {
  const router = useRouter();
  const [signOut] = useSignOut(auth);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeMascot, setActiveMascot] = useState(mascotHappy);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div>
      <Bars3Icon
        className="absolute z-40 w-10 h-10 p-1 border rounded-xl text-fuchsia-700 border-fuchsia-700 left-8 top-12"
        onClick={toggleSidebar}
      />
      <aside
        className={classNames(
          "fixed inset-y-0 left-0 bg-gradient-to-r from-[#210D30] to-[#180924] shadow-md w-72 lg:w-60 z-40 lg:block border-r border-purple-950",
          sidebarVisible ? "" : "hidden"
        )}
      >
        <div className="flex flex-col justify-between h-full">
          <CloseIcon
            onClick={toggleSidebar}
            className="absolute z-40 w-10 h-10 border cursor-pointer rounded-xl right-1 top-10 ml-28 border-fuchsia-700 text-fuchsia-700 lg:hidden"
          />

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
                            currentPath === item.href
                              ? "bg-purple-950 text-white relative"
                              : "",
                            "group flex items-center rounded-xl font-normal text-sm text-fuchsia-200 hover:text-white py-3 px-3 hover:bg-purple-900 border-fuchsia-900 gap-x-2"
                          )}
                        >
                          {currentPath === item.href && (
                            <div className="absolute left-0.5 block w-0.5 py-3 bg-fuchsia-700 bca-glow-left"></div>
                          )}
                          {IconElement && (
                            <IconElement
                              className={classNames(
                                currentPath === item.href ? "text-white" : "",
                                "w-5 h-5 text-fuchsia-200 group-hover:text-white-400 shrink-0"
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
            <div className="p-4 lg:mt-36">
              <div className="mb-6 border-purple-900 thin-line"></div>
              <Link
                target="_blank"
                href="https://docs.bcaprotocol.org/get-started"
                className="flex items-center px-4 py-2 text-sm group rounded-xl text-fuchsia-200 hover:text-white hover:bg-purple-900 gap-x-2"
              >
                <BookOpenIcon
                  className="w-5 h-5 text-fuchsia-200 group-hover:text-white-400 shrink-0"
                  aria-hidden="true"
                />
                <div className="flex flex-col">
                  <p className="text-sm font-semibold">Docs</p>
                  <p className="text-xs">how to get started</p>
                </div>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center w-full mt-8">
            <Image
              src={activeMascot}
              onClick={() => {
                if (activeMascot == mascotHappy) {
                  setActiveMascot(mascotLove);
                } else {
                  setActiveMascot(mascotHappy);
                }
              }}
              alt="Mascot"
              width={320}
              className="cursor-pointer opacity-30 hover:opacity-100"
            />
          </div>
          <div className="flex items-center justify-center w-full p-4 text-center cursor-pointer group">
            <button
              onClick={handleSignOut}
              type="button"
              className="inline-flex items-center justify-center text-center px-3 py-2 space-x-1 text-base font-thin transition border border-purple-900 cursor-pointer text-fuchsia-300 hover:text-fuchsia-800 rounded-xl bg-[#250C3D]"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 shrink-0" />
              <span>Logout</span>
            </button>{" "}
          </div>
        </div>
      </aside>
    </div>
  );
}
