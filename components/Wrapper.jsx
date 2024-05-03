import Link from "next/link";
import React from "react";
import { useMoralis } from "react-moralis";
import { ConnectButton } from "web3uikit";
import { usePathname } from "next/navigation";

const Wrapper = ({ children }) => {
  const { isWeb3Enabled } = useMoralis();
  const pathname = usePathname();

  console.log(pathname);

  return (
    <div className="bg-black w-screen h-screen flex flex-col justify-center  items-center ">
      <ConnectButton moralisAuth={false} />
      <span className="h-10"></span>
      {pathname !== "/view" &&
        pathname !== "/" &&
        pathname !== "/register" &&
        pathname !== "/login" && (
          <>
            <Link href={"/view"} className="bg-white px-2 py-2">
              View Cases
            </Link>
            <span className="h-10"></span>
          </>
        )}
      {pathname === "/view" && (
        <>
          <Link href={"/add"} className="bg-white px-2 py-2">
            Add Case
          </Link>
          <span className="h-10"></span>
        </>
      )}
      {isWeb3Enabled && children}
    </div>
  );
};

export default Wrapper;
