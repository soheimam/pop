import { Icons } from "@/components/ui/Icons";
import { ComethWallet } from "@cometh/connect-sdk";
import { CheckIcon, ExitIcon, EnterIcon } from "@radix-ui/react-icons";

interface ConnectWalletProps {
  connectionError: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  connect: () => Promise<void>;
  wallet: ComethWallet;
}

function ConnectWallet({
  connectionError,
  isConnecting,
  isConnected,
  connect,
  wallet,
}: ConnectWalletProps): JSX.Element {
  const getTextButton = () => {
    if (isConnected) {
      return (
        <>
          <ExitIcon width={20} height={20} />
          <a
            href={`https://mumbai.polygonscan.com/address/${wallet.getAddress()}`}
            target="_blank"
            className="text-xs mt-1"
          >
            {"Log out"}
          </a>
        </>
      );
    } else if (isConnecting) {
      return (
        <>
          <Icons.spinner className="h-6 w-6 animate-spin" />
          {"Logging in..."}
        </>
      );
    } else {
      return (
        <>
          {" "}
          <EnterIcon width="24" height="24" /> {"Log In"}
        </>
      );
    }
  };

  return (
    <>
      {!connectionError ? (
        <button
          disabled={isConnecting || isConnected || !!connectionError}
          className="text-white text-xs bg-blue-500 hover:bg-blue-600 transition ease-in-out p-4 rounded-tr-md rounded-br-md flex flex-col items-center justify-center"
          onClick={connect}
        >
          {getTextButton()}
        </button>
      ) : (
        <p className="flex items-center justify-center text-gray-900 bg-red-50">
          Connection denied
        </p>
      )}
    </>
  );
}

export default ConnectWallet;
