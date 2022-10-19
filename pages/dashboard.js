import { auth } from "../utils/firebase";
import Link from "next/link";
//from react firebase hooks package
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import {
  collection,
  where,
  onSnapshot,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Comment from "../components/Comment";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
const dashboard = () => {
  //init router
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [userComments, setUserComments] = useState([]);
  //check if user is logged in
  const getData = (async) => {
    if (loading) return;
    if (!user) return route.push("/auth/login");
    const collectionRef = collection(db, "posts");
    //query db for comments made by user with id = to current authed user
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUserComments(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    return unsubscribe;
  };

  //delete comment

  const deleteComment = async (id) => {
    //target doc to be deleted
    const docRef = doc(db, "posts", id);
    //call firebase method to delete selected comment
    await deleteDoc(docRef);
  };

  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div>
      <h1>Your Comments</h1>
      <div className=" flex gap-4 my-12 text-lg font-medium items-center">
        {userComments.map((comment) => {
          return (
            <Comment {...comment} key={comment.id}>
              <div className="flex">
                <button
                  className="flex items-center justify-center gap-2 py-2 text-sm"
                  onClick={() => {
                    deleteComment(comment.id);
                  }}
                >
                  <BsTrash2Fill />
                  Delete
                </button>
                <Link href={{ pathname: "/post", query: comment }}>
                  <button className="flex items-center justify-center gap-2 py-2 text-sm">
                    <AiFillEdit />
                    Edit
                  </button>
                </Link>
              </div>
            </Comment>
          );
        })}
      </div>
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
