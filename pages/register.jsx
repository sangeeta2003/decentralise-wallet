import React, { useEffect, useState } from "react";
import contractAddress from "../Constants/contractAddress.json";
import abi from "../Constants/abi.json";
import Wrapper from "../components/Wrapper";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useRouter } from "next/router";

const Register = () => {
  const { runContractFunction } = useWeb3Contract({});
  const { runContractFunction: userTypeIndexView } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "userTypeIndexView",
  });
  const [userTypes, setUserTypes] = useState([]);
  const [userIndex, setUserIndex] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const onload = async () => {
      try {
        await userTypeIndexView({
          onSuccess(results) {
            setUserTypes(results);
            console.log(results);
          },
          onError(error) {
            console.log(error);
            setUserTypes([]);
          },
        });
      } catch (e) {
        console.log(e);
      }
    };

    onload();
  }, [userTypeIndexView]);

  const registerUser = async (el) => {
    el.preventDefault();

    try {
      const data = await runContractFunction({
        params: {
          abi: abi,
          contractAddress: contractAddress,
          functionName: "registeringUserType",
          params: {
            index: userIndex,
          },
        },
      });

      console.log(data);
      alert("Added");

      router.push("/add");
      // setSubmitted(true);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Wrapper>
      <form className="flex flex-col gap-2">
        {userTypes && (
          <select
            className="px-2 py-1"
            value={userIndex}
            onChange={(e) => {
              setUserIndex(e.target.value);
            }}
          >
            {userTypes.map((u, i) => {
              return (
                <option key={u} value={i}>
                  {u}
                </option>
              );
            })}
          </select>
        )}
        <button className="text-black bg-white" onClick={registerUser}>
          Register
        </button>
      </form>
    </Wrapper>
  );
};

export default Register;
