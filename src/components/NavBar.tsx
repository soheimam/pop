// components/Footer.js
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
    <footer className="p-4 bg-blue-500 fixed bottom-0 w-full">
      <nav className="flex justify-between max-w-screen-md mx-auto">
        <Link href="/home" passHref legacyBehavior>
          <a className="text-white" aria-label="Home">
            <HomeIcon />
          </a>
        </Link>
        <Link href="/profile" passHref legacyBehavior>
          <a className="text-white" aria-label="Profile">
            <PersonIcon />
          </a>
        </Link>
        <Link href="/inbox" passHref legacyBehavior>
          <a className="text-white" aria-label="Inbox">
            <ChatBubbleIcon />
          </a>
        </Link>
        <Link href="/notifications" passHref legacyBehavior>
          <a className="text-white" aria-label="Notifications">
            <BellIcon />
          </a>
        </Link>
        <Link href="/wallet" passHref legacyBehavior>
          <a className="text-white" aria-label="Wallet">
            <ExitIcon />
          </a>
        </Link>
      </nav>
    </footer>
  );
}

export default NavBar;
