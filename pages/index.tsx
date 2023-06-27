import Layout, { pages, roles } from "@/components/layout/Layout";
import { DCastContext } from "@/context/DCast";
import { VotingPhase } from "@/types";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CheckVotingSessionPage() {
  // ---------------------------------------------------------------------//
  const {
    currentAccount,
    checkIfWalletIsConnected,
    checkAccountType,
    getVotingSessionDetails,
  } = useContext(DCastContext);
  const [role, setRole] = useState<roles | null>(null);

  useEffect(() => {
    checkIfWalletIsConnected();

    if (currentAccount) {
      console.log("currentAccount", currentAccount);

      checkAccountType(currentAccount).then((accountType) => {
        setRole(accountType as roles);
      });
    } else {
      setRole(null);
    }
  }, [currentAccount]);

  console.log("role", role);
  // ---------------------------------------------------------------------//

  const [votingSessionId, setVotingSessionId] = useState<string>("");
  const [votingSessionDetails, setVotingSessionDetails] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loadingToast = toast.loading("Loading...");
    getVotingSessionDetails(Number(votingSessionId)).then(
      (votingSessionDetails: any) => {
        setVotingSessionDetails(votingSessionDetails);
        if (votingSessionDetails === null) {
          setErrorMessage(
            `Voting Session with ID ${votingSessionId} does not exist.`
          );
          toast.dismiss(loadingToast);
          toast.error(`Voting Session with ID ${votingSessionId} not found.`);
          return;
        }
        setErrorMessage("");
        toast.dismiss(loadingToast);
        toast.success("Details retrieved successfully!");
      }
    );
  };

  console.log("votingSessionDetails", votingSessionDetails);

  return (
    <Layout
      currentPage="/"
      currentRole={
        role !== null
          ? ((role.toLowerCase() === "owner" || role.toLowerCase() === "admin"
              ? "admin"
              : role.toLowerCase()) as roles)
          : "guest"
      }
    >
      <div className="p-4 md:ml-80">
        <h1 className="text-2xl font-semibold text-slate-800 mt-3 mb-5">
          {pages["/"].title}
        </h1>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="voting-session-id"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Voting Session ID
                </label>
                <input
                  type="number"
                  value={votingSessionId}
                  onChange={(e) => {
                    setVotingSessionId(e.target.value);
                  }}
                  id="voting-session-id"
                  className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-blue-500/20"
                  placeholder="e.g. 1"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="text-white rounded-lg bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </form>
        </div>

        {votingSessionDetails !== null && (
          <>
            <div className="relative overflow-x-auto rounded-lg border shadow mt-8 text-sm font-medium mr-2">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <colgroup>
                  <col style={{ width: "35%" }} />
                  <col style={{ width: "65%" }} />
                </colgroup>
                <thead className=" text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" colSpan={2} className="px-6 py-3">
                      Session Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Session ID
                    </th>
                    <td className="px-6 py-4">
                      {votingSessionDetails.details[0].toNumber()}
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Name
                    </th>
                    <td className="px-6 py-4">
                      {votingSessionDetails.details[1]}
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Phase
                    </th>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                        {votingSessionDetails.details[2] === 0
                          ? "Registration"
                          : votingSessionDetails.details[2] === 1
                          ? "Voting"
                          : "Close"}
                      </span>
                    </td>
                  </tr>
                  <tr
                    className={`bg-white ${
                      votingSessionDetails.details[2] === 0 ? "" : "border-b"
                    } dark:bg-gray-800 dark:border-gray-700`}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Registration Date & Time
                    </th>
                    <td className="px-6 py-4">
                      {`${new Date(
                        votingSessionDetails.details[3].toNumber() * 1000
                      ).toLocaleDateString()} ${new Date(
                        votingSessionDetails.details[3].toNumber() * 1000
                      ).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}`}
                    </td>
                  </tr>
                  {(votingSessionDetails.details[2] === 1 ||
                    votingSessionDetails.details[2] === 2) && (
                    <tr
                      className={`bg-white ${
                        votingSessionDetails.details[2] === 2 ? "border-b" : ""
                      } dark:bg-gray-800 dark:border-gray-700`}
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Voting Date & Time
                      </th>
                      <td className="px-6 py-4">
                        {`${new Date(
                          votingSessionDetails.details[4].toNumber() * 1000
                        ).toLocaleDateString()} ${new Date(
                          votingSessionDetails.details[4].toNumber() * 1000
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}`}
                      </td>
                    </tr>
                  )}
                  {votingSessionDetails.details[2] === 2 && (
                    <tr className="bg-white dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Close Date & Time
                      </th>
                      <td className="px-6 py-4">
                        {`${new Date(
                          votingSessionDetails.details[5].toNumber() * 1000
                        ).toLocaleDateString()} ${new Date(
                          votingSessionDetails.details[5].toNumber() * 1000
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}`}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-4">
              Candidate Details
            </h2>
            {votingSessionDetails.candidateDetails.length > 0 ? (
              <div className="relative overflow-x-auto rounded-lg border shadow mt-8 text-sm font-medium mr-2">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <colgroup>
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "33%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "20%" }} />
                  </colgroup>
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        CANDIDATE ID
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        NAME
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        DESCRIPTION
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        VOTE COUNT
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        STATUS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {votingSessionDetails.candidateDetails.map(
                      (candidateData: any, index: any) => (
                        <tr
                          key={`${index}-voter`}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        >
                          <td className="px-6 py-4">
                            {candidateData[0].toNumber()}
                          </td>
                          <td className="px-4 py-4 flex items-center gap-4 capitalize font-bold text-gray-900">
                            <img
                              src={candidateData[3]}
                              alt="candidate image"
                              className="w-14 h-14 rounded-full object-contain"
                            />
                            {candidateData[1]}
                          </td>
                          <td className="px-6 py-4">{candidateData[2]}</td>
                          <td className="px-6 py-4">
                            {candidateData[4].toNumber()}
                          </td>
                          <td className="px-6 py-4">
                            {(() => {
                              if (votingSessionDetails.details[2] === 2) {
                                for (const winnerId of votingSessionDetails.winnerCandidateIds) {
                                  if (
                                    candidateData[0].toNumber() ===
                                    winnerId.toNumber()
                                  ) {
                                    return (
                                      <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                        Won
                                      </span>
                                    );
                                  }
                                }
                                return (
                                  <span className="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                    Lose
                                  </span>
                                );
                              }
                              return (
                                <span className="bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-900 dark:text-gray-300">
                                  -
                                </span>
                              );
                            })()}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mb-3 text-gray-500 dark:text-gray-400">
                There are no candidates registered.
              </div>
            )}

            <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-4">
              Voter Details
            </h2>
            {votingSessionDetails.voterDetails.length > 0 ? (
              <div className="relative overflow-x-auto rounded-lg border shadow mt-8 text-sm font-medium mr-2">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        VOTER ID
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        ACCOUNT ADDRESS
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        WEIGHT
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        VOTED CANDIDATE ID
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {votingSessionDetails.voterDetails.map(
                      (voterData: any, index: any) => (
                        <tr
                          key={`${index}-voter`}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        >
                          <td className="px-6 py-4">
                            {voterData[0].toNumber()}
                          </td>
                          <td className="px-6 py-4">{voterData[1]}</td>
                          {
                            <>
                              <td className="px-6 py-4">
                                {votingSessionDetails.voterVSDetails[index][0]}
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`${
                                    votingSessionDetails.voterVSDetails[
                                      index
                                    ][1].toNumber() === 0
                                      ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                                      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  } text-sm font-medium mr-2 px-2.5 py-0.5 rounded`}
                                >
                                  {votingSessionDetails.voterVSDetails[
                                    index
                                  ][1].toNumber() === 0
                                    ? "No Vote"
                                    : `Voted: ${votingSessionDetails.voterVSDetails[
                                        index
                                      ][1].toNumber()}`}
                                </span>
                              </td>
                            </>
                          }
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mb-3 text-gray-500 dark:text-gray-400">
                There are no voter accounts registered.
              </div>
            )}
          </>
        )}
        {/* {votingSessionDetails !== null &&
          votingSessionDetails?.details[2] === 0 && (
            <>
              <div className="mt-8 text-sm font-medium mr-2 pr-2.5 py-0.5">
                Durian Status :{" "}
                <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                  {statuses[durianDetails.status]}
                </span>
              </div>
              {durianDetails.farmDetails && (
                <table className="border w-full mt-4 text-sm text-left text-gray-500 dark:text-gray-400">
                  <colgroup>
                    <col style={{ width: "35%" }} />
                    <col style={{ width: "65%" }} />
                  </colgroup>
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" colSpan={2} className="px-6 py-3">
                        Farm Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Farm ID
                      </th>
                      <td className="px-6 py-4">
                        {durianDetails.farmDetails[0].toNumber()}
                      </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Tree ID
                      </th>
                      <td className="px-6 py-4">
                        {durianDetails.farmDetails[1].toNumber()}
                      </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Variety Code
                      </th>
                      <td className="px-6 py-4">
                        {durianDetails.farmDetails[2]}
                      </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Harvested Date & Time
                      </th>
                      <td className="px-6 py-4">
                        {`${new Date(
                          durianDetails.farmDetails[3].toNumber() * 1000
                        ).toLocaleDateString()} ${new Date(
                          durianDetails.farmDetails[3].toNumber() * 1000
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}`}
                      </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Durian Image
                      </th>
                      <td className="px-6 py-4">
                        <img
                          src={durianDetails.farmDetails[4]}
                          alt="Durian"
                          className="w-32 h-32 rounded-lg object-contain border"
                        />
                      </td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Condition
                      </th>
                      <td className="px-6 py-4">
                        {ratings[durianDetails.farmDetails[5]]}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {durianDetails.DCDetails && (
                <table className="border w-full mt-8 text-sm text-left text-gray-500 dark:text-gray-400">
                  <colgroup>
                    <col style={{ width: "35%" }} />
                    <col style={{ width: "65%" }} />
                  </colgroup>
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" colSpan={2} className="px-6 py-3">
                        Distribution Center Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Distribution Center ID
                      </th>
                      <td className="px-6 py-4">
                        {durianDetails.DCDetails[0].toNumber()}
                      </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Arrival Date & Time
                      </th>
                      <td className="px-6 py-4">
                        {`${new Date(
                          durianDetails.DCDetails[1].toNumber() * 1000
                        ).toLocaleDateString()} ${new Date(
                          durianDetails.DCDetails[1].toNumber() * 1000
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}`}
                      </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Durian Image
                      </th>
                      <td className="px-6 py-4">
                        <img
                          src={durianDetails.DCDetails[2]}
                          alt="Durian"
                          className="w-32 h-32 rounded-lg object-contain border"
                        />
                      </td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Condition
                      </th>
                      <td className="px-6 py-4">
                        {ratings[durianDetails.DCDetails[3]]}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {durianDetails.RTDetails && (
                <table className="border w-full mt-8 text-sm text-left text-gray-500 dark:text-gray-400">
                  <colgroup>
                    <col style={{ width: "35%" }} />
                    <col style={{ width: "65%" }} />
                  </colgroup>
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" colSpan={2} className="px-6 py-3">
                        Retailer Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Retailer ID
                      </th>
                      <td className="px-6 py-4">
                        {durianDetails.RTDetails[0].toNumber()}
                      </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Arrival Date & Time
                      </th>
                      <td className="px-6 py-4">
                        {`${new Date(
                          durianDetails.RTDetails[1].toNumber() * 1000
                        ).toLocaleDateString()} ${new Date(
                          durianDetails.RTDetails[1].toNumber() * 1000
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}`}
                      </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Durian Image
                      </th>
                      <td className="px-6 py-4">
                        <img
                          src={durianDetails.RTDetails[2]}
                          alt="Durian"
                          className="w-32 h-32 rounded-lg object-contain border"
                        />
                      </td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Condition
                      </th>
                      <td className="px-6 py-4">
                        {ratings[durianDetails.RTDetails[3]]}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {durianDetails.soldDetails && (
                <table className="border w-full mt-8 text-sm text-left text-gray-500 dark:text-gray-400">
                  <colgroup>
                    <col style={{ width: "35%" }} />
                    <col style={{ width: "65%" }} />
                  </colgroup>
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" colSpan={2} className="px-6 py-3">
                        Sold Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Consumer ID
                      </th>
                      <td className="px-6 py-4">
                        {durianDetails.soldDetails[0].toNumber()}
                      </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Sold Date & Time
                      </th>
                      <td className="px-6 py-4">
                        {`${new Date(
                          durianDetails.soldDetails[1].toNumber() * 1000
                        ).toLocaleDateString()} ${new Date(
                          durianDetails.soldDetails[1].toNumber() * 1000
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}`}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {durianDetails.ratingDetails && (
                <table className="border w-full mt-8 text-sm text-left text-gray-500 dark:text-gray-400">
                  <colgroup>
                    <col style={{ width: "35%" }} />
                    <col style={{ width: "65%" }} />
                  </colgroup>
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" colSpan={2} className="px-6 py-3">
                        Rating Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Durian Image
                      </th>
                      <td className="px-6 py-4">
                        <img
                          src={durianDetails.ratingDetails[0]}
                          alt="Durian"
                          className="w-32 h-32 rounded-lg object-contain border"
                        />
                      </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Taste
                      </th>
                      <td className="px-6 py-4">
                        {ratings[durianDetails.ratingDetails[1]]}
                      </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Fragrance
                      </th>
                      <td className="px-6 py-4">
                        {ratings[durianDetails.ratingDetails[2]]}
                      </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Creaminess
                      </th>
                      <td className="px-6 py-4">
                        {ratings[durianDetails.ratingDetails[3]]}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </>
          )} */}

        {errorMessage !== "" && votingSessionDetails === null && (
          <div className="mt-8 text-sm text-left text-gray-500 dark:text-gray-400">
            <p className="text-red-500">{errorMessage}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
