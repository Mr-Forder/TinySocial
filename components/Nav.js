import Link from "next/link";
import { auth } from "../utils/firebase";
//from react firebase hooks package
import { useAuthState } from "react-firebase-hooks/auth";

export default function Nav() {
  const [user, loading] = useAuthState(auth);

  return (
    <nav className="flex justify-between items-center py-10">
      <Link href="/">
        <button className="text-2xl font-bold mr-4">TinySocial.</button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link href={"/auth/login"}>
            <a className="py-2 px-4 text-sm bg-cyan-600 text-white rounded-lg font-medium ml-8">
              Join Now
            </a>
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-3">
            <Link href="/post" className="">
              <button className="py-2 px-4 text-sm bg-cyan-600 text-white rounded-lg font-medium">
                Start Posting!
              </button>
            </Link>
            <Link href="/Dashboard">
              <button className="py-2 px-4 text-sm bg-pink-600 text-white rounded-lg font-medium">
                My Dashboard
              </button>
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
}
