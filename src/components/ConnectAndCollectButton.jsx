import { abi } from "@/resources/abi";
import { handleTaskCompletion } from "@/utils/utils";
import { ConnectKitButton } from "connectkit";
import { ConnectKitProvider } from "connectkit";
import { useEffect, useState, useRef } from "react";
import { useAccount, useWriteContract } from "wagmi";

const ConnectAndCollectButton = ({ userData }) => {
  const [address, setAddress] = useState(null);
  const {
    address: accountAddress,
    chain,
    chainId,
    connector,
    isConnected,
  } = useAccount();
  const contractAddress = process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS;
  const { writeContract, isLoading, isSuccess, error, isPending } =
    useWriteContract();
  const prevAccountAddressRef = useRef();

  const [pendingTransaction, setPendingTransaction] = useState(false);

  // const {
  //   data: result,
  //   isError,
  //   isLoading,
  // } = useReadContract({
  //   abi: abi,
  //   address: contractAddress,
  //   functionName: "getUserPoints",
  //   args: ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"],
  // });

  const doWrite = () => {
    setPendingTransaction(true);
    writeContract({
      abi,
      address: contractAddress,
      functionName: "startDataCollection",
    });
  };

  const connectKitOptions = {
    initialChainId: 0
  }

  useEffect(() => {
    if (
      (prevAccountAddressRef.current === null ||
        prevAccountAddressRef.current === undefined) &&
      accountAddress
    ) {
      if (pendingTransaction !== true) {
        if (
          userData.completedTasks?.hasOwnProperty("generateCookie") === false
        ) {
          console.log(
            "Wallet connected, attempting to generate cookie and register on the blockchain"
          );
          if (pendingTransaction !== true) {
            setPendingTransaction(true);
            console.log("Processing cookie generation...");
            setTimeout(() => doWrite(), 500);
          }
        }
      }
    }
    prevAccountAddressRef.current = accountAddress;
  }, [accountAddress]);

  useEffect(() => {
    if (isSuccess) {
      const handlePostCookieGeneration = async () => {
        try {
          const taskCompletion = await handleTaskCompletion(
            userData.userId,
            "generateCookie",
            {
              walletData: {
                address: accountAddress ?? address ?? "unknown",
                chain: chain?.name ?? "unknown",
                chainId: chainId ?? "unknown",
              },
            }
          );
          if (taskCompletion) {
            const maxAge = new Date(
              "Fri, 31 Dec 9999 23:59:59 GMT"
            ).toUTCString();
            document.cookie = `BCAID=${encodeURIComponent(
              userData.userId
            )}; expires=${maxAge}; path=/; Secure; SameSite=None`;
            window.location.reload();
          } else {
            console.log("Error generating cookie");
          }
        } catch (error) {
          console.error("Error generating cookie:", error);
        }
      };

      handlePostCookieGeneration();
    }

    if (error !== undefined && error !== null) {
      console.log("Cookie generation rejected by user", error);
      setPendingTransaction(false);
    }
  }, [isSuccess, error]);

  return (
    <>
      {isLoading ? (
        <div className="text-lg text-white">Completing task...</div>
      ) : (
        <div className="flex flex-col items-start justify-start w-2/3 space-y-2">
          {isConnected &&
            userData.completedTasks?.hasOwnProperty("generateCookie") ==
              false && (
              <button
                disabled={pendingTransaction === true}
                className="min-h-10 py-1 text-base px-2 text-white transition w-full duration-500 ease-in-out transform shadow-lg cursor-pointer disabled:bg-[#383838] disabled:text-[#686868] bg-fuchsia-700 rounded-lg"
                onClick={doWrite}
              >
                Generate AI-smart cookie
              </button>
            )}
          {pendingTransaction ? (
            <div>Pending...</div>
          ) : (
            <div disabled={pendingTransaction}>
              <ConnectKitProvider
                onConnect={({ address }) => setAddress(address)}
                onDisconnect={() => setAddress(null)}
                options={connectKitOptions}
              >
                <ConnectKitButton
                  theme="auto"
                  mode="dark"
                  label="Generate AI-smart cookie"
                  className="hover:-translate-y-1"
                />
              </ConnectKitProvider>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ConnectAndCollectButton;
