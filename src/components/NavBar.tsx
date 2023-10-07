// components/Footer.js
"use client";
import Link from "next/link";
import {
  HomeIcon,
  PersonIcon,
  ChatBubbleIcon,
  BellIcon,
  ExitIcon,
} from "@radix-ui/react-icons";

function NavBar() {
  return (
    <footer className=" fixed bottom-0 max-w-2/3  mb-6 bg-blue-500 rounded-md transform -translate-x-1/2 left-1/2">
      <div className="flex justify-between max-w-screen-md mx-auto">
        <Link href="/" passHref legacyBehavior>
          <a
            className="text-white bg-blue-500 hover:bg-blue-600 p-4 rounded-tl-md rounded-bl-md transition ease-in-out"
            aria-label="Home"
          >
            <HomeIcon width="24" height="24" />
          </a>
        </Link>
        <Link href="/profile" passHref legacyBehavior>
          <a
            className="text-white bg-blue-500 hover:bg-blue-600 p-4 overflow-hidden transition ease-in-out"
            aria-label="Profile"
          >
            <PersonIcon width="24" height="24" />
          </a>
        </Link>
        <Link href="/inbox" passHref legacyBehavior>
          <a
            className="text-white bg-blue-500 hover:bg-blue-600 p-4 transition ease-in-out"
            aria-label="Inbox"
          >
            <ChatBubbleIcon width="24" height="24" />
          </a>
        </Link>
        <Link href="/notifications" passHref legacyBehavior>
          <a
            className="text-white bg-blue-500 hover:bg-blue-600 p-4 transition ease-in-out"
            aria-label="Notifications"
          >
            <BellIcon width="24" height="24" />
          </a>
        </Link>
        <Link href="/wallet" passHref legacyBehavior>
          <a
            className="text-white bg-blue-500 hover:bg-blue-600 transition ease-in-out p-4 rounded-tr-md rounded-br-md"
            aria-label="Wallet"
          >
            <ExitIcon width="24" height="24" />
          </a>
        </Link>
      </div>
    </footer>
  );
}

export default NavBar;
