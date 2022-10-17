import { auth } from "../utils/firebase";
//from react firebase hooks package
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const dashboard = () => {
  //init router
  const route = useRouter();
  const [user, loading] = useAuthState(auth);

  //check if user is logged in
  const getData = (async) => {
    if (loading) return;
    if (!user) return route.push("/auth/login");
  };

  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div>
      <h1>Your Comments</h1>
      <div className="">posts</div>
      <button
        onClick={() => auth.signOut()}
        className="py-2 px-4 text-sm bg-cyan-600 text-white rounded-lg font-medium ml-8"
      >
        Sign Out
      </button>
    </div>
  );
};

export default dashboard;
