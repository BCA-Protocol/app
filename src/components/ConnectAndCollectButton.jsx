import { abi } from "@/resources/abi";
import { handleTaskCompletion } from "@/utils/utils";
import { ConnectKitButton } from "connectkit";
import { ConnectKitProvider } from "connectkit";
import { useEffect, useState } from "react";
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
  const { writeContract, isLoading, isSuccess, error } = useWriteContract();

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
    writeContract({
      abi,
      address: contractAddress,
      functionName: "startDataCollection",
    });
  };

  useEffect(() => {
    if (address) {
      if (userData.completedTasks?.hasOwnProperty("generateCookie") == false) {
        console.log(
          "Wallet connected, attempting to generate cookie and register on the blockchain"
        );
        doWrite();
      }
    }
  }, [address]);

  useEffect(() => {
    if (isSuccess) {
      const handlePostCookieGeneration = async () => {
        try {
          const taskCompletion = await handleTaskCompletion(
            userData.userId,
            "generateCookie",
            {
              walletData: {
                address: accountAddress,
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

    if (error !== undefined) {
      console.log("Cookie generation rejected by user", error);
    }
  }, [isSuccess, error]);

  return (
    <>
      {isLoading ? (
        <div className="text-lg text-white">Completing task...</div>
      ) : (
        <div className="inline-flex items-center justify-between space-x-2">
          {isConnected &&
            userData.completedTasks?.hasOwnProperty("generateCookie") ==
              false && (
              <div
                className="py-1 text-xs text-white transition duration-500 ease-in-out transform shadow-lg cursor-pointer bg-fuchsia-700 rounded-xl"
                onClick={doWrite}
              >
                Generate AI-smart cookie
              </div>
            )}
          <ConnectKitProvider
            onConnect={({ address }) => setAddress(address)}
            onDisconnect={() => setAddress(null)}
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
    </>
  );
};

export default ConnectAndCollectButton;
