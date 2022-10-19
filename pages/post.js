import { auth, db } from "../utils/firebase";
//from react firebase hooks package
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
const post = () => {
  //init router
  const route = useRouter();
  const routeData = route.query;
  //form state
  const [post, setPost] = useState({
    description: "",
  });
  const [user, loading] = useAuthState(auth);

  //submit form
  const submitComment = async (e) => {
    e.preventDefault();

    //form validation checks

    if (!post.description.length) {
      toast.error("Please write a comment before submitting...");
      return;
    }

    if (!post.description.length > 300) {
      toast.error("Comment too long!");
      return;
    }

    //check to see if post aleady has an id (edit comment) or not (new comment)
    if (post?.hasOwnProperty("id")) {
      //target doc to be edited
      const docRef = doc(db, "posts", post.id);
      //create updated comment, by spreading in current post object, setting timestamp via firebase server time
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      //then, run firebase updateDoc method, passing in the targeted firebase doc and the updated post we just created
      await updateDoc(docRef, updatedPost);
      //finally, return and take us to the index page
      toast.success("Comment Edited!");
      return route.push("/");
    } else {
      //ELSE, JUST CREATE A NEW COMMENT
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
      });
      //reset content
      setPost({ description: "" });
      toast.success("Comment Created!");
      //redirect to main
      return route.push("/");
    }
  };

  // check user
  const checkUser = async () => {
    if (loading) return;
    if (!user) {
      route.push("/auth/login");
    }
    if (routeData.id) {
      setPost({ description: routeData.description, id: routeData.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
      <form onSubmit={submitComment}>
        <h1 className="text-2xl font-bold">
          {post.hasOwnProperty("id")
            ? "Edit your comment"
            : "Create a new comment"}
        </h1>
        <div className="py-2">
          <h3 className="text-lg font-medium py-2">Description</h3>
          <textarea
            onChange={(e) => {
              setPost({ ...post, description: e.target.value });
            }}
            value={post.description}
            className="bg-gray-700 h-48 w-full text-white rounded-lg p-2 text-sm border-2"
          ></textarea>
          <p
            className={`text-cyan-400 font-medium text-small ${
              post.description.length > 300 ? "text-red-600" : ""
            }`}
          >
            {post.description.length}/300
          </p>
        </div>
        <button
          type="submit"
          className="py-2 px-4 text-sm bg-cyan-600 text-white rounded-lg font-medium w-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default post;
