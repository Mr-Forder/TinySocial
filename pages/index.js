import Head from "next/head";
import Image from "next/image";
import Comment from "../components/Comment";
import { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { toast } from "react-toastify";
import Link from "next/link";
export default function Home() {
  //comment list state
  const [allPosts, setAllPosts] = useState([]);

  //GET ALL POSTS
  const getComments = async () => {
    //target firebase db and collection
    const collectionRef = collection(db, "posts");
    //use firebase query to query and sort collection
    const q = query(collectionRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <div>
      <Head>
        <title>Tiny Social</title>
        <meta name="description" content="Welcome to TinySocial" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="my-12 text-lg font-medium">
        <h2 className="text-xl">See what people are saying...</h2>
        {allPosts.map((comment) => (
          <Comment {...comment} key={comment.id}>
            <Link href={{ pathname: `/${comment.id}`, query: { ...comment } }}>
              <button className="text-xs">
                Comments (
                {comment?.comments?.length > 0 ? comment.comments.length : "0"})
              </button>
            </Link>
          </Comment>
        ))}
      </div>
    </div>
  );
}
