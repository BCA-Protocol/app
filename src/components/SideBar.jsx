import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "/public/bca-left.png";
import mascotHappy from "/public/m/4-small.png";
import mascotLove from "/public/m/8-small.png";

import { useSignOut,useAuthState } from "react-firebase-hooks/auth";
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
    title: "Leaderboard",
    icon: TrophyIcon,
  },
  // {
  //   href: "/quest",
  //   title: "Quest",
  //   icon: RocketLaunchIcon,
  // },
];

export default function SideBar({ currentPath }) {
  const router = useRouter();
  const [signOut] = useSignOut(auth);
  const [user] = useAuthState(auth);
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
  console.log('user',user?.email)

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

            <div className="">
              <ul className="space-y-2">
                <li key="1st">
                  <div
                    className="group flex items-center rounded-xl font-normal text-sm text-fuchsia-200 hover:text-white py-3 px-3 hover:bg-purple-900 border-fuchsia-900 gap-x-2"
                  >
                      <div className="w-5 h-5 text-fuchsia-200 group-hover:text-white-400 shrink-0">
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5387 11.8024C7.62228 11.7188 7.71781 11.683 7.83722 11.683C8.14768 11.683 8.39844 11.6114 8.58949 11.4681C8.78054 11.3248 8.87607 11.0979 8.87607 10.7875C8.87607 10.5486 8.79248 10.3576 8.62531 10.2024C8.45814 10.0471 8.24321 9.97548 7.99245 9.97548C7.74169 9.97548 7.50287 10.0591 7.31182 10.2382C7.20435 10.3457 7.08495 10.3934 6.96554 10.3934C6.88195 10.3934 6.79836 10.3695 6.72672 10.3098C6.60731 10.2143 6.54761 10.1068 6.54761 9.97548C6.54761 9.86802 6.59537 9.77249 6.67896 9.67696C6.84613 9.49785 7.04912 9.3665 7.276 9.27098C7.50287 9.17545 7.74169 9.12769 8.00439 9.12769C8.32679 9.12769 8.61337 9.19933 8.87607 9.34262C9.13877 9.48591 9.3537 9.6889 9.50893 9.93966C9.66417 10.1904 9.73581 10.477 9.73581 10.7875C9.73581 11.2412 9.60446 11.5994 9.3537 11.8621C9.091 12.1248 8.75666 12.292 8.32679 12.3517C8.30291 12.3517 8.29097 12.3756 8.29097 12.3875V12.6502C8.29097 12.7696 8.25515 12.8771 8.17156 12.9607C8.08797 13.0443 7.99245 13.0801 7.87304 13.0801C7.75363 13.0801 7.64616 13.0443 7.57452 12.9607C7.49093 12.8771 7.45511 12.7816 7.45511 12.6502V12.1129C7.45511 11.9935 7.49093 11.886 7.57452 11.8024H7.5387ZM7.49093 14.2384C7.41929 14.1667 7.38347 14.0592 7.38347 13.9279V13.8085C7.38347 13.6771 7.41929 13.5697 7.49093 13.498C7.56258 13.4264 7.67005 13.3906 7.80139 13.3906H7.89692C8.02827 13.3906 8.13574 13.4264 8.20738 13.498C8.27903 13.5697 8.31485 13.6771 8.31485 13.8085V13.9279C8.31485 14.0592 8.27903 14.1667 8.20738 14.2384C8.13574 14.31 8.02827 14.3458 7.89692 14.3458H7.80139C7.67005 14.3458 7.56258 14.31 7.49093 14.2384Z" fill="#ECB5FF"/>
                        <path d="M5.2698 5.07982H4.7698C4.7698 5.35596 4.99365 5.57982 5.2698 5.57982V5.07982ZM7.92066 5.07982V5.57982C8.1968 5.57982 8.42066 5.35596 8.42066 5.07982H7.92066ZM21.569 17.0206H22.069C22.069 16.7445 21.8452 16.5206 21.569 16.5206V17.0206ZM10.5476 17.0206V16.5206C10.2715 16.5206 10.0476 16.7445 10.0476 17.0206H10.5476ZM7.40872 7.10976C7.40872 7.3859 7.63258 7.60976 7.90872 7.60976C8.18486 7.60976 8.40872 7.3859 8.40872 7.10976H7.40872ZM19.0495 17.0206H18.5495C18.5495 17.2968 18.7734 17.5206 19.0495 17.5206V17.0206ZM9.03404 19.0181C8.77207 18.9307 8.48891 19.0723 8.40159 19.3343C8.31426 19.5963 8.45584 19.8794 8.71781 19.9667L9.03404 19.0181ZM6.92957 15.946L7.03804 15.4579C6.88999 15.425 6.73501 15.4611 6.61671 15.556C6.49841 15.6509 6.42957 15.7943 6.42957 15.946H6.92957ZM8.88787 15.946H9.38787C9.38787 15.7936 9.31839 15.6495 9.19914 15.5547C9.0799 15.4598 8.92391 15.4245 8.77544 15.4588L8.88787 15.946ZM10.1894 4.78281C9.91328 4.78281 9.68942 5.00667 9.68942 5.28281C9.68942 5.55895 9.91328 5.78281 10.1894 5.78281V4.78281ZM17.1151 5.78281C17.3912 5.78281 17.6151 5.55895 17.6151 5.28281C17.6151 5.00667 17.3912 4.78281 17.1151 4.78281V5.78281ZM12.697 7.21874C12.4209 7.21874 12.197 7.4426 12.197 7.71874C12.197 7.99488 12.4209 8.21874 12.697 8.21874V7.21874ZM17.1151 8.21874C17.3912 8.21874 17.6151 7.99488 17.6151 7.71874C17.6151 7.4426 17.3912 7.21874 17.1151 7.21874V8.21874ZM13.9508 9.64273C13.6746 9.64273 13.4508 9.86659 13.4508 10.1427C13.4508 10.4189 13.6746 10.6427 13.9508 10.6427V9.64273ZM17.1151 10.6427C17.3912 10.6427 17.6151 10.4189 17.6151 10.1427C17.6151 9.86659 17.3912 9.64273 17.1151 9.64273V10.6427ZM13.9508 12.0787C13.6746 12.0787 13.4508 12.3025 13.4508 12.5787C13.4508 12.8548 13.6746 13.0787 13.9508 13.0787V12.0787ZM17.1151 13.0787C17.3912 13.0787 17.6151 12.8548 17.6151 12.5787C17.6151 12.3025 17.3912 12.0787 17.1151 12.0787V13.0787ZM12.697 14.5146C12.4209 14.5146 12.197 14.7384 12.197 15.0146C12.197 15.2907 12.4209 15.5146 12.697 15.5146V14.5146ZM17.1151 15.5146C17.3912 15.5146 17.6151 15.2907 17.6151 15.0146C17.6151 14.7384 17.3912 14.5146 17.1151 14.5146V15.5146ZM5.7698 5.07982V3.88574H4.7698V5.07982H5.7698ZM5.7698 3.88574C5.7698 3.43349 6.14298 3.0603 6.59523 3.0603V2.0603C5.5907 2.0603 4.7698 2.8812 4.7698 3.88574H5.7698ZM6.59523 3.0603C7.04748 3.0603 7.42066 3.43349 7.42066 3.88574H8.42066C8.42066 2.8812 7.59976 2.0603 6.59523 2.0603V3.0603ZM7.42066 3.88574V5.07982H8.42066V3.88574H7.42066ZM22.069 18.2147V17.0206H21.069V18.2147H22.069ZM21.569 16.5206H10.5476V17.5206H21.569V16.5206ZM10.0476 17.0206V18.2147H11.0476V17.0206H10.0476ZM10.0476 18.2147C10.0476 18.667 9.67446 19.0402 9.22221 19.0402V20.0402C10.2267 20.0402 11.0476 19.2193 11.0476 18.2147H10.0476ZM9.22221 20.0402H20.2436V19.0402H9.22221V20.0402ZM20.2436 20.0402C21.2481 20.0402 22.069 19.2193 22.069 18.2147H21.069C21.069 18.667 20.6958 19.0402 20.2436 19.0402V20.0402ZM8.40872 7.10976V3.88574H7.40872V7.10976H8.40872ZM8.40872 3.88574C8.40872 2.88711 7.60564 2.0603 6.59523 2.0603V3.0603C7.0416 3.0603 7.40872 3.42758 7.40872 3.88574H8.40872ZM6.59523 3.0603H17.5091V2.0603H6.59523V3.0603ZM17.5091 3.0603C18.0902 3.0603 18.5495 3.52648 18.5495 4.10067H19.5495C19.5495 2.97926 18.6476 2.0603 17.5091 2.0603V3.0603ZM18.5495 4.10067V17.0206H19.5495V4.10067H18.5495ZM19.0495 17.5206H21.569V16.5206H19.0495V17.5206ZM9.22221 19.0402C9.1317 19.0402 9.07135 19.0305 9.03404 19.0181L8.71781 19.9667C8.89544 20.026 9.07391 20.0402 9.22221 20.0402V19.0402ZM7.90872 15.5534C7.61107 15.5534 7.32503 15.5217 7.03804 15.4579L6.82111 16.4341C7.17891 16.5136 7.53768 16.5534 7.90872 16.5534V15.5534ZM6.42957 15.946V21.785H7.42957V15.946H6.42957ZM6.42957 21.785C6.42957 22.5985 7.09524 23.2642 7.90872 23.2642V22.2642C7.64752 22.2642 7.42957 22.0462 7.42957 21.785H6.42957ZM7.90872 23.2642C8.7222 23.2642 9.38787 22.5985 9.38787 21.785H8.38787C8.38787 22.0462 8.16992 22.2642 7.90872 22.2642V23.2642ZM9.38787 21.785V15.946H8.38787V21.785H9.38787ZM8.77544 15.4588C8.50488 15.5212 8.20847 15.5534 7.90872 15.5534V16.5534C8.27766 16.5534 8.64993 16.514 9.0003 16.4332L8.77544 15.4588ZM11.8865 11.5756C11.8865 13.7725 10.1056 15.5534 7.90872 15.5534V16.5534C10.6579 16.5534 12.8865 14.3248 12.8865 11.5756H11.8865ZM7.90872 15.5534C5.71184 15.5534 3.93091 13.7725 3.93091 11.5756H2.93091C2.93091 14.3248 5.15955 16.5534 7.90872 16.5534V15.5534ZM3.93091 11.5756C3.93091 9.37875 5.71184 7.59782 7.90872 7.59782V6.59782C5.15955 6.59782 2.93091 8.82646 2.93091 11.5756H3.93091ZM7.90872 7.59782C10.1056 7.59782 11.8865 9.37875 11.8865 11.5756H12.8865C12.8865 8.82646 10.6579 6.59782 7.90872 6.59782V7.59782ZM10.1894 5.78281H17.1151V4.78281H10.1894V5.78281ZM12.697 8.21874H17.1151V7.21874H12.697V8.21874ZM13.9508 10.6427H17.1151V9.64273H13.9508V10.6427ZM13.9508 13.0787H17.1151V12.0787H13.9508V13.0787ZM12.697 15.5146H17.1151V14.5146H12.697V15.5146ZM7.92066 4.57982H5.2698V5.57982H7.92066V4.57982Z" fill="#ECB5FF"/>
                      </svg>
                      </div>
                      {/* <div className="flex"> */}
                        <div class="w-[151px] h-[31px] font-inter font-normal text-[16px] leading-[19px] flex items-center text-center bg-gradient-to-r from-[#ECB5FF] to-[#8E6D99] bg-clip-text text-transparent order-2 flex-none flex-grow-0 z-2">
                          Crowdsourced Data Collection
                        </div>
                      {/* </div> */}
                  </div>
                </li>
                <li key='2nd'>
                  <div class="font-inter font-normal text-[14px]  text-center bg-gradient-to-r from-[#ECB5FF] to-[#8E6D99] bg-clip-text text-transparent">
                    User-Contributed Text
                  </div>
                  <div class="font-inter font-normal text-[14px]  text-center bg-gradient-to-r from-[#ECB5FF] to-[#8E6D99] bg-clip-text text-transparent">
                    Audio and Speech Data
                  </div>
                  <div class="font-inter font-normal text-[14px]  text-center bg-gradient-to-r from-[#ECB5FF] to-[#8E6D99] bg-clip-text text-transparent">
                    Image and Video Data
                  </div>
                </li>
              </ul>
            </div>
            <div className="mt-2">
              <ul className="">
                <li key="1st">
                  <div
                    className="group flex items-center rounded-xl font-normal text-sm text-fuchsia-200 hover:text-white py-3 px-3 hover:bg-purple-900 border-fuchsia-900 gap-x-2"
                  >
                      <div className="w-5 h-5 text-fuchsia-200 group-hover:text-white-400 shrink-0">
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5387 11.8024C7.62228 11.7188 7.71781 11.683 7.83722 11.683C8.14768 11.683 8.39844 11.6114 8.58949 11.4681C8.78054 11.3248 8.87607 11.0979 8.87607 10.7875C8.87607 10.5486 8.79248 10.3576 8.62531 10.2024C8.45814 10.0471 8.24321 9.97548 7.99245 9.97548C7.74169 9.97548 7.50287 10.0591 7.31182 10.2382C7.20435 10.3457 7.08495 10.3934 6.96554 10.3934C6.88195 10.3934 6.79836 10.3695 6.72672 10.3098C6.60731 10.2143 6.54761 10.1068 6.54761 9.97548C6.54761 9.86802 6.59537 9.77249 6.67896 9.67696C6.84613 9.49785 7.04912 9.3665 7.276 9.27098C7.50287 9.17545 7.74169 9.12769 8.00439 9.12769C8.32679 9.12769 8.61337 9.19933 8.87607 9.34262C9.13877 9.48591 9.3537 9.6889 9.50893 9.93966C9.66417 10.1904 9.73581 10.477 9.73581 10.7875C9.73581 11.2412 9.60446 11.5994 9.3537 11.8621C9.091 12.1248 8.75666 12.292 8.32679 12.3517C8.30291 12.3517 8.29097 12.3756 8.29097 12.3875V12.6502C8.29097 12.7696 8.25515 12.8771 8.17156 12.9607C8.08797 13.0443 7.99245 13.0801 7.87304 13.0801C7.75363 13.0801 7.64616 13.0443 7.57452 12.9607C7.49093 12.8771 7.45511 12.7816 7.45511 12.6502V12.1129C7.45511 11.9935 7.49093 11.886 7.57452 11.8024H7.5387ZM7.49093 14.2384C7.41929 14.1667 7.38347 14.0592 7.38347 13.9279V13.8085C7.38347 13.6771 7.41929 13.5697 7.49093 13.498C7.56258 13.4264 7.67005 13.3906 7.80139 13.3906H7.89692C8.02827 13.3906 8.13574 13.4264 8.20738 13.498C8.27903 13.5697 8.31485 13.6771 8.31485 13.8085V13.9279C8.31485 14.0592 8.27903 14.1667 8.20738 14.2384C8.13574 14.31 8.02827 14.3458 7.89692 14.3458H7.80139C7.67005 14.3458 7.56258 14.31 7.49093 14.2384Z" fill="#ECB5FF"/>
                        <path d="M5.2698 5.07982H4.7698C4.7698 5.35596 4.99365 5.57982 5.2698 5.57982V5.07982ZM7.92066 5.07982V5.57982C8.1968 5.57982 8.42066 5.35596 8.42066 5.07982H7.92066ZM21.569 17.0206H22.069C22.069 16.7445 21.8452 16.5206 21.569 16.5206V17.0206ZM10.5476 17.0206V16.5206C10.2715 16.5206 10.0476 16.7445 10.0476 17.0206H10.5476ZM7.40872 7.10976C7.40872 7.3859 7.63258 7.60976 7.90872 7.60976C8.18486 7.60976 8.40872 7.3859 8.40872 7.10976H7.40872ZM19.0495 17.0206H18.5495C18.5495 17.2968 18.7734 17.5206 19.0495 17.5206V17.0206ZM9.03404 19.0181C8.77207 18.9307 8.48891 19.0723 8.40159 19.3343C8.31426 19.5963 8.45584 19.8794 8.71781 19.9667L9.03404 19.0181ZM6.92957 15.946L7.03804 15.4579C6.88999 15.425 6.73501 15.4611 6.61671 15.556C6.49841 15.6509 6.42957 15.7943 6.42957 15.946H6.92957ZM8.88787 15.946H9.38787C9.38787 15.7936 9.31839 15.6495 9.19914 15.5547C9.0799 15.4598 8.92391 15.4245 8.77544 15.4588L8.88787 15.946ZM10.1894 4.78281C9.91328 4.78281 9.68942 5.00667 9.68942 5.28281C9.68942 5.55895 9.91328 5.78281 10.1894 5.78281V4.78281ZM17.1151 5.78281C17.3912 5.78281 17.6151 5.55895 17.6151 5.28281C17.6151 5.00667 17.3912 4.78281 17.1151 4.78281V5.78281ZM12.697 7.21874C12.4209 7.21874 12.197 7.4426 12.197 7.71874C12.197 7.99488 12.4209 8.21874 12.697 8.21874V7.21874ZM17.1151 8.21874C17.3912 8.21874 17.6151 7.99488 17.6151 7.71874C17.6151 7.4426 17.3912 7.21874 17.1151 7.21874V8.21874ZM13.9508 9.64273C13.6746 9.64273 13.4508 9.86659 13.4508 10.1427C13.4508 10.4189 13.6746 10.6427 13.9508 10.6427V9.64273ZM17.1151 10.6427C17.3912 10.6427 17.6151 10.4189 17.6151 10.1427C17.6151 9.86659 17.3912 9.64273 17.1151 9.64273V10.6427ZM13.9508 12.0787C13.6746 12.0787 13.4508 12.3025 13.4508 12.5787C13.4508 12.8548 13.6746 13.0787 13.9508 13.0787V12.0787ZM17.1151 13.0787C17.3912 13.0787 17.6151 12.8548 17.6151 12.5787C17.6151 12.3025 17.3912 12.0787 17.1151 12.0787V13.0787ZM12.697 14.5146C12.4209 14.5146 12.197 14.7384 12.197 15.0146C12.197 15.2907 12.4209 15.5146 12.697 15.5146V14.5146ZM17.1151 15.5146C17.3912 15.5146 17.6151 15.2907 17.6151 15.0146C17.6151 14.7384 17.3912 14.5146 17.1151 14.5146V15.5146ZM5.7698 5.07982V3.88574H4.7698V5.07982H5.7698ZM5.7698 3.88574C5.7698 3.43349 6.14298 3.0603 6.59523 3.0603V2.0603C5.5907 2.0603 4.7698 2.8812 4.7698 3.88574H5.7698ZM6.59523 3.0603C7.04748 3.0603 7.42066 3.43349 7.42066 3.88574H8.42066C8.42066 2.8812 7.59976 2.0603 6.59523 2.0603V3.0603ZM7.42066 3.88574V5.07982H8.42066V3.88574H7.42066ZM22.069 18.2147V17.0206H21.069V18.2147H22.069ZM21.569 16.5206H10.5476V17.5206H21.569V16.5206ZM10.0476 17.0206V18.2147H11.0476V17.0206H10.0476ZM10.0476 18.2147C10.0476 18.667 9.67446 19.0402 9.22221 19.0402V20.0402C10.2267 20.0402 11.0476 19.2193 11.0476 18.2147H10.0476ZM9.22221 20.0402H20.2436V19.0402H9.22221V20.0402ZM20.2436 20.0402C21.2481 20.0402 22.069 19.2193 22.069 18.2147H21.069C21.069 18.667 20.6958 19.0402 20.2436 19.0402V20.0402ZM8.40872 7.10976V3.88574H7.40872V7.10976H8.40872ZM8.40872 3.88574C8.40872 2.88711 7.60564 2.0603 6.59523 2.0603V3.0603C7.0416 3.0603 7.40872 3.42758 7.40872 3.88574H8.40872ZM6.59523 3.0603H17.5091V2.0603H6.59523V3.0603ZM17.5091 3.0603C18.0902 3.0603 18.5495 3.52648 18.5495 4.10067H19.5495C19.5495 2.97926 18.6476 2.0603 17.5091 2.0603V3.0603ZM18.5495 4.10067V17.0206H19.5495V4.10067H18.5495ZM19.0495 17.5206H21.569V16.5206H19.0495V17.5206ZM9.22221 19.0402C9.1317 19.0402 9.07135 19.0305 9.03404 19.0181L8.71781 19.9667C8.89544 20.026 9.07391 20.0402 9.22221 20.0402V19.0402ZM7.90872 15.5534C7.61107 15.5534 7.32503 15.5217 7.03804 15.4579L6.82111 16.4341C7.17891 16.5136 7.53768 16.5534 7.90872 16.5534V15.5534ZM6.42957 15.946V21.785H7.42957V15.946H6.42957ZM6.42957 21.785C6.42957 22.5985 7.09524 23.2642 7.90872 23.2642V22.2642C7.64752 22.2642 7.42957 22.0462 7.42957 21.785H6.42957ZM7.90872 23.2642C8.7222 23.2642 9.38787 22.5985 9.38787 21.785H8.38787C8.38787 22.0462 8.16992 22.2642 7.90872 22.2642V23.2642ZM9.38787 21.785V15.946H8.38787V21.785H9.38787ZM8.77544 15.4588C8.50488 15.5212 8.20847 15.5534 7.90872 15.5534V16.5534C8.27766 16.5534 8.64993 16.514 9.0003 16.4332L8.77544 15.4588ZM11.8865 11.5756C11.8865 13.7725 10.1056 15.5534 7.90872 15.5534V16.5534C10.6579 16.5534 12.8865 14.3248 12.8865 11.5756H11.8865ZM7.90872 15.5534C5.71184 15.5534 3.93091 13.7725 3.93091 11.5756H2.93091C2.93091 14.3248 5.15955 16.5534 7.90872 16.5534V15.5534ZM3.93091 11.5756C3.93091 9.37875 5.71184 7.59782 7.90872 7.59782V6.59782C5.15955 6.59782 2.93091 8.82646 2.93091 11.5756H3.93091ZM7.90872 7.59782C10.1056 7.59782 11.8865 9.37875 11.8865 11.5756H12.8865C12.8865 8.82646 10.6579 6.59782 7.90872 6.59782V7.59782ZM10.1894 5.78281H17.1151V4.78281H10.1894V5.78281ZM12.697 8.21874H17.1151V7.21874H12.697V8.21874ZM13.9508 10.6427H17.1151V9.64273H13.9508V10.6427ZM13.9508 13.0787H17.1151V12.0787H13.9508V13.0787ZM12.697 15.5146H17.1151V14.5146H12.697V15.5146ZM7.92066 4.57982H5.2698V5.57982H7.92066V4.57982Z" fill="#ECB5FF"/>
                      </svg>
                      </div>
                        <div class="w-[151px] h-[31px] font-inter font-normal text-[16px]  flex items-center text-center bg-gradient-to-r from-[#ECB5FF] to-[#8E6D99] bg-clip-text text-transparent order-2 flex-none flex-grow-0 z-2">
                          Distributed Training
                        </div>
                  </div>
                </li>
                <li key='2nd'>
                  <div class="font-inter font-normal text-[14px]  text-center bg-gradient-to-r from-[#ECB5FF] to-[#8E6D99] bg-clip-text text-transparent">
                    Federated Training
                  </div>
                </li>
              </ul>
            </div>
            <div className="p-4 lg:mt-36">
              <div className="mb-6 border-purple-900 thin-line"></div>
              <div className="flex flex-col">
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
            {
              process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(',')?.includes(user?.email) && (
                <>
              <div className="mb-2 border-purple-900"></div>
              <Link
                // target="_blank"
                href="/admin"
                className="flex items-center px-4 py-2 text-sm group rounded-xl text-fuchsia-200 hover:text-white hover:bg-purple-900 gap-x-2"
              >
                <RocketLaunchIcon
                  className={classNames(
                    currentPath === "/admin" ? "text-white" : "",
                    "w-5 h-5 text-fuchsia-200 group-hover:text-white-400 shrink-0"
                  )}
                  aria-hidden="true"
                />
                <div className="flex flex-col">
                  <p className="text-sm font-semibold">Admin</p>
                </div>
              </Link>
              </>)}
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
