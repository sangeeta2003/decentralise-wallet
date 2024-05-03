import React, { useEffect, useState } from "react";
import contractAddress from "../Constants/contractAddress.json";
import abi from "../Constants/abi.json";
import Wrapper from "../components/Wrapper";
import { useWeb3Contract } from "react-moralis";
import Link from "next/link";
import { viewCaseFn } from "../utils/CaseData";

const View = () => {
  const [caseWorkingList, setCaseWorkingList] = useState([]);
  const [caseTypeList, setCaseTypeList] = useState([]);
  const [cases, setCases] = useState([]);

  const { runContractFunction: CaseWorkingIndexView } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "CaseWorkingIndexView",
  });
  const { runContractFunction: CaseTypeIndexView } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "CaseTypeIndexView",
  });

  useEffect(() => {
    const onload = async () => {
      try {
        setCases(viewCaseFn());

        await CaseWorkingIndexView({
          onSuccess(results) {
            setCaseWorkingList(results);
            console.log(results);
          },
          onError(error) {
            console.log(error);
            setCaseWorkingList([]);
          },
        });
        await CaseTypeIndexView({
          onSuccess(results) {
            setCaseTypeList(results);
            console.log(results);
          },
          onError(error) {
            console.log(error);
            setCaseTypeList([]);
          },
        });
      } catch (e) {
        console.log(e);
      }
    };

    onload();
  }, [CaseTypeIndexView, CaseWorkingIndexView]);

  return (
    <Wrapper>
      <ul>
        {cases.map((tempCase) => {
          return (
            <li
              key={`${tempCase.caseNumber}-==+${tempCase.doc}`}
              className="w-[90vw] max-w-[80rem] bg-slate-400 p-2"
            >
              <p>Case Number: {tempCase.caseNumber}</p>
              <p>
                Date: {new Date(tempCase.date).toLocaleTimeString()}{" "}
                {new Date(tempCase.date).toLocaleDateString()}
              </p>
              <p>Case Type: {caseTypeList[tempCase.caseTypeIndex]}</p>
              <p>Case Status: {caseWorkingList[tempCase.caseWorkingIndex]}</p>
              <Link href={tempCase.doc} target="_blank">
                Doc Link
              </Link>
            </li>
          );
        })}
      </ul>
    </Wrapper>
  );
};

export default View;
