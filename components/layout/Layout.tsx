import Link from "next/link";
import { SidebarIcons } from "../svg/SidebarIcons.svg";
import React, { useContext, useEffect, useRef, useState } from "react";
import { LogoSvg } from "../svg/Logo.svg";
import { DCastContext } from "../../context/DCast";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

function Tooltip({
  message,
  children,
}: {
  message: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative flex z-10">
      {children}
      <span className="absolute bottom-8 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
        {message}
      </span>
    </div>
  );
}

export type roles = "admin" | "voter" | "guest";

export type paths =
  | "/"
  | "/add-voting-session"
  | "/register-voter-candidate"
  | "/update-voting-phase"
  | "/add-account"
  | "/view-accounts"
  | "/my-voting-sessions"
  | "/cast-vote";

export const pages: {
  [key in paths]: {
    title: string;
    access: roles;
  };
} = {
  "/": {
    title: "Check Voting Session",
    access: "guest",
  },
  "/add-voting-session": {
    title: "Add Voting Session",
    access: "admin",
  },
  "/register-voter-candidate": {
    title: "Register Voter/Candidate",
    access: "admin",
  },
  "/update-voting-phase": {
    title: "Update Voting Phase",
    access: "admin",
  },
  "/add-account": {
    title: "Add Account",
    access: "admin",
  },
  "/view-accounts": {
    title: "View Accounts",
    access: "admin",
  },
  "/my-voting-sessions": {
    title: "My Voting Sessions",
    access: "voter",
  },
  "/cast-vote": {
    title: "Cast Vote",
    access: "voter",
  },
};

type LayoutProps = {
  children: React.ReactNode;
  currentPage: keyof typeof pages;
  currentRole: roles;
};

const Layout: React.FC<LayoutProps> = ({
  children,
  currentPage,
  currentRole,
}) => {
  const {
    connectWallet,
    currentAccount,
    checkIfWalletIsConnected,
    isWalletConnected,
  } = useContext(DCastContext);
  const router = useRouter();

  const handleConnectMetamask = async () => {
    if (isWalletConnected === true) {
      toast.success("An account is connected");
      return;
    }
    await connectWallet();
  };

  const handleViewAddress = () => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-[460px] w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-center">
            <p className="text-sm font-medium text-gray-900">
              {currentAccount}
            </p>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => navigator.clipboard.writeText(currentAccount)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Copy
          </button>
        </div>
      </div>
    ));
  };

  useEffect(() => {
    console.log("render");
    const handleAccountChange = async () => {
      console.log("Account changed");

      await checkIfWalletIsConnected();
      toast("Account changed.", {
        icon: "🙍‍♂️",
      });
      router.push("/");
    };

    try {
      window.ethereum.on("accountsChanged", handleAccountChange);
    } catch (error) {
      console.log(error);
    }

    // Clean up the event listener when the component unmounts
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountChange);
    };
  }, []);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const childrenRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      childrenRef.current &&
      !childrenRef.current.contains(event.target as Node)
    ) {
      setSidebarVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        onClick={toggleSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-72 h-screen transition-transform ${
          sidebarVisible ? "-translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 gap-[16px] overflow-y-auto bg-gray-50 dark:bg-gray-800 flex flex-col">
          <div className="flex items-center px-2 mt-5 mb-4">
            <LogoSvg />
          </div>
          <ul className="space-y-2 font-medium">
            {Object.entries(pages).map(([path, { title, access }]) => {
              if (currentRole !== access && path !== "/") return null;
              return (
                <li key={path}>
                  <Link
                    href={path}
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <SidebarIcons
                      isActive={path === currentPage}
                      path={path as paths}
                    />
                    <span
                      className={`flex-1 ml-3 whitespace-nowrap ${
                        currentPage === path && "text-primary"
                      }`}
                    >
                      {title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-auto">
            {currentRole === "guest" ? (
              currentAccount ? (
                <Tooltip message="Click to view address">
                  <span
                    onClick={handleViewAddress}
                    className="cursor-pointer bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-700 dark:text-blue-300"
                  >
                    Guest User (CONNECTED)
                  </span>
                </Tooltip>
              ) : (
                <span className="bg-gray-300 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                  Guest User (UNCONNECTED)
                </span>
              )
            ) : (
              <Tooltip message="Click to view address">
                <span
                  onClick={handleViewAddress}
                  className="cursor-pointer bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                >
                  Connected as{" "}
                  {currentRole.replace(/\w\S*/g, function (txt) {
                    return (
                      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                    );
                  })}
                </span>
              </Tooltip>
            )}
          </div>
          <button
            onClick={handleConnectMetamask}
            className="transition-all font-medium flex items-center justify-center text-primary w-full h-12 min-h-[48px] rounded border border-primary hover:text-white hover:bg-primary"
          >
            Connect MetaMask
          </button>
        </div>
      </aside>

      <div
        ref={childrenRef}
        style={{
          pointerEvents: sidebarVisible ? "none" : "auto",
          filter: sidebarVisible ? "blur(4px) grayscale(40%)" : "none",
          transition: "filter 0.3s ease",
        }}
      >
        {children}
      </div>
    </>
  );
};

export default Layout;
