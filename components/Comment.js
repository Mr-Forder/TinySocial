import React from "react";

const Comment = ({ children, avatar, usernme, description }) => {
  return (
    <div className="bg-gray-700 p-4 my-2 rounded-lg">
      <div className="flex items-center gap-2">
        <img src={avatar} className="w-10 rounded-full" />
        <h2 className="text-sm">{usernme}</h2>
      </div>
      <div className="py-4 px-16">
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
};

export default Comment;
