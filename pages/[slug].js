import Comment from "../components/Comment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { toast } from "react-toastify";
import {
  doc,
  arrayUnion,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  getDoc,
} from "firebase/firestore";
const slug = () => {
  //init router
  const router = useRouter();
  //grab data from router query object (passed down from index page, in Link component)
  const routeData = router.query;

  const [message, setMessage] = useState("");
  const [allMessage, setAllMessage] = useState([]);

  //SUBMIT A COMMENT
  const submitMessage = async () => {
    //check to see if user is authed
    if (!auth.currentUser) {
      return router.push("/auth/login");
    }
    if (!message) {
      toast.error("Comment field is empty!");
      return;
    }
    //target post - db posts, id equal to the routeData query we passed down in the index's link component
    const docRef = doc(db, "posts", routeData.id);
    //call firebase updateDoc method, passing in post we just targeted, adding in new data via firebase arrayUinion method
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });
    //reset text field
    setMessage("");
  };

  //GET COMMENTS
  const getComments = async () => {
    //target post - db posts, id equal to the routeData query we passed down in the index's link component
    const docRef = doc(db, "posts", routeData.id);
    //get db snapshot via fb method, pass in our target

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      //pull just the comments from retrieved data and set it into state
      setAllMessage(snapshot.data().comments);
    });
    return unsubscribe;
  };

  useEffect(() => {
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]);

  return (
    <div>
      <div>
        <Comment {...routeData}></Comment>
        <div className="my-4">
          <div className="flex">
            <input
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              value={message}
              placeholder="Add a comment"
              className="bg-gray-800 w-full p-2 text-white text-sm"
            />
            <button
              onClick={submitMessage}
              className="bg-cyan-500 text-white py-2 px-4 text-sm"
            >
              Submit
            </button>
          </div>
          <div className="py-6">
            <h2 className="font-bold">Comments</h2>
            {allMessage?.map((message) => (
              <div
                className="bg-gray-900 p-4 my-4 border-2 rounded-lg"
                key={message.time}
              >
                <div className="flex items-center gap-2 mb-4">
                  <img
                    className="w-10 rounded-full"
                    src={message.avatar}
                    alt=""
                  />
                  <h2>{message.userName}</h2>
                </div>
                <h2>{message.message}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default slug;
