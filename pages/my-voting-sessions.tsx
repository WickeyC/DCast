import Layout, { pages, roles } from "@/components/layout/Layout";
import { DCastContext } from "@/context/DCast";
import router from "next/router";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function MyVotingSessionsPage() {
  // ---------------------------------------------------------------------//
  const {
    currentAccount,
    checkIfWalletIsConnected,
    checkAccountType,
    getVoterID,
    getSingleVoterDetails,
    getVotingSessionDetails,
  } = useContext(DCastContext);
  const [role, setRole] = useState<roles | null | undefined>(undefined);

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

  useEffect(() => {
    const currentRole =
      role !== null && role !== undefined
        ? ((role.toLowerCase() === "owner" || role.toLowerCase() === "admin"
            ? "admin"
            : role.toLowerCase()) as roles)
        : role === null
        ? "guest"
        : undefined;
    //Restrict users from accessing unaccessible pages with their roles
    if (
      role !== undefined &&
      currentRole != pages["/my-voting-sessions"].access
    ) {
      toast.error("You have no access to that page.");
      router.push("/");
    }
  }, [role]);

  console.log("role", role);
  // ---------------------------------------------------------------------//

  const [isLoaded, setIsLoaded] = useState(false);
  const [voterAddress, setVoterAddress] = useState<string>("");
  const [voterId, setVoterId] = useState<number>();
  const [votingSessionDetailsArray, setVotingSessionDetailsArray] =
    useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loadingToast = toast.loading("Loading...");

    try {
      const voterDetails = await getSingleVoterDetails(currentAccount);
      if (voterDetails[2].length === 0) {
        setVotingSessionDetailsArray(null);
      }

      setVotingSessionDetailsArray(
        voterDetails[2].map((votingId: any) => {
          return getVotingSessionDetails(votingId);
        })
      );

      setIsLoaded(true);
      toast.dismiss(loadingToast);
      toast.success("Details retrieved successfully!");
    } catch (error) {
      setVotingSessionDetailsArray(null);
      toast.dismiss(loadingToast);
      toast.error("Error retrieving details");
    }
  };

  useEffect(() => {
    if (currentAccount) {
      getVoterID(currentAccount).then((voterId?) => {
        setVoterId(Number(voterId));
      });
    }
  }, [currentAccount]);

  return (
    <Layout
      currentPage="/my-voting-sessions"
      currentRole={
        role !== null && role !== undefined
          ? ((role.toLowerCase() === "owner" || role.toLowerCase() === "admin"
              ? "admin"
              : role.toLowerCase()) as roles)
          : "guest"
      }
    >
      <div className="p-4 md:ml-80">
        <h1 className="text-2xl font-semibold text-slate-800 mt-3 mb-5">
          {pages["/my-voting-sessions"].title}
        </h1>
        <div>
          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              className="text-white rounded-lg bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800"
            >
              View
            </button>
          </form>
        </div>

        {isLoaded &&
          (votingSessionDetailsArray !== null ? (
            <>
              <div className="relative overflow-x-auto rounded-lg border shadow mt-8 text-sm font-medium mr-2">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        SESSIOn ID
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        SESSION NAME
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        SESSION PHASE
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        VOTING WEIGHT
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        VOTED CANDIDATE ID
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {votingSessionDetailsArray.map(
                      (votingSessionDetails: any, index: any) => (
                        <tr
                          key={`${index}-voting-session`}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        >
                          <td className="px-6 py-4">
                            {votingSessionDetails.details[0].toNumber()}
                          </td>
                          <td className="px-6 py-4">
                            {votingSessionDetails.details[1]}
                          </td>
                          //TODO: left phase weight candidate id.
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
            </>
          ) : (
            <></>
          ))}
      </div>
    </Layout>
  );
}
