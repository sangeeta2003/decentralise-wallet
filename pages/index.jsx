import { useMoralis, useWeb3Contract } from "react-moralis";
import Wrapper from "../components/Wrapper";
import Link from "next/link";

// Moralis.initialize("YOUR_APP_ID");

// Moralis = Moralis.default;

export default function Home(props) {
  const { isWeb3Enabled } = useMoralis();

  return (
    // <div className="bg-black w-screen h-screen flex justify-center items-center">
    <Wrapper>
      {isWeb3Enabled && (
        <div className="flex flex-col gap-4 w-[7rem]">
          <Link
            className="bg-slate-200 px-2 py-1 rounded-lg flex justify-center items-center"
            href={"/register"}
          >
            Register
          </Link>
          <Link
            className="bg-slate-200 px-2 py-1 rounded-lg flex justify-center items-center"
            href={"/add"}
          >
            Login
          </Link>
        </div>
      )}
    </Wrapper>
    // </div>
  );
}

export async function getServerSideProps() {
  return {
    props: { timeNow: parseInt(Date.now().toString()) }, // will be passed to the page component as props
  };
}
