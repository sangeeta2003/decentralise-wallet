import React, { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import contractAddress from "../Constants/contractAddress.json";
import abi from "../Constants/abi.json";
import { useWeb3Contract } from "react-moralis";
import { addCaseFn } from "../utils/CaseData";

const Add = () => {
  const [caseWorkingList, setCaseWorkingList] = useState([]);
  const [caseTypeList, setCaseTypeList] = useState([]);
  const [date, setDate] = useState(Date.now());
  const [caseWorkingIndex, setCaseWorkingIndex] = useState(0);
  const [caseTypeIndex, setCaseTypeIndex] = useState(0);
  const [doc, setDoc] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [names, setNames] = useState("");
  const [judge, setJudge] = useState("");
  const [lawyer, setLawyer] = useState("");
  const [defendant, setDefendant] = useState("");
  const [plaintiff, setPlaintiff] = useState("");
  const { runContractFunction } = useWeb3Contract({});
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

  const addCase = async (el) => {
    el.preventDefault();

    try {
      const data = await runContractFunction({
        params: {
          abi: abi,
          contractAddress: contractAddress,
          functionName: "addCase",
          params: {
            date: date,
            caseWorkingIndex: caseWorkingIndex,
            caseTypeIndex: caseTypeIndex,
            doc: doc,
            caseNumber: caseNumber,
            names: names,
            judge: judge,
            lawyer: lawyer,
            defendant: defendant,
            plaintiff: plaintiff,
          },
        },
      });

      addCaseFn({
        date,
        caseWorkingIndex,
        caseTypeIndex,
        doc,
        caseNumber,
        names,
        judge,
        lawyer,
        defendant,
        plaintiff,
      });

      setDate(Date.now());
      setCaseWorkingIndex(0);
      setCaseTypeIndex(0);
      setDoc("");
      setCaseNumber("");
      setNames("");
      setJudge("");
      setLawyer("");
      setDefendant("");
      setPlaintiff("");

      console.log(data);
      alert("Added");
      // setSubmitted(true);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Wrapper>
      <form className="flex flex-col gap-3">
        <input
          type="datetime-local"
          className="px-2 py-2"
          onChange={(e) => {
            setDate(new Date(e.target.value).getTime());
          }}
        />
        {caseWorkingList && (
          <select
            className="px-2 py-3"
            value={caseWorkingIndex}
            onChange={(e) => {
              setCaseWorkingIndex(e.target.value);
            }}
          >
            {caseWorkingList.map((u, i) => {
              return (
                <option key={u} value={i}>
                  {u}
                </option>
              );
            })}
          </select>
        )}
        {caseTypeList && (
          <select
            className="px-2 py-3"
            value={caseTypeIndex}
            onChange={(e) => {
              setCaseTypeIndex(e.target.value);
            }}
          >
            {caseTypeList.map((u, i) => {
              return (
                <option key={u} value={i}>
                  {u}
                </option>
              );
            })}
          </select>
        )}
        <input
          type="text"
          placeholder="Case Numberx"
          className="px-2 py-3"
          onChange={(e) => {
            setCaseNumber(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Names"
          className="px-2 py-3"
          onChange={(e) => {
            setNames(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Doc Url"
          className="px-2 py-3"
          onChange={(e) => {
            setDoc(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Judge Public Address"
          className="px-2 py-3"
          onChange={(e) => {
            setJudge(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Lawyer Public Address"
          className="px-2 py-3"
          onChange={(e) => {
            setLawyer(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Defendant Public Address"
          className="px-2 py-3"
          onChange={(e) => {
            setDefendant(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Plaintiff Public Address"
          className="px-2 py-3"
          onChange={(e) => {
            setPlaintiff(e.target.value);
          }}
        />
        <button className="px-2 py-2 text-black bg-white" onClick={addCase}>
          Submit
        </button>
      </form>
    </Wrapper>
  );
};

export default Add;
