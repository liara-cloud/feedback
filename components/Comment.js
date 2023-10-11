import faDataString from "@/utils/faDataString";
import React from "react";

const Comment = ({ comment }) => {
  return (
    <div className="mb-2 p-2 rounded-md bg-[#e4e2e407] text-sm font-thin">
      <div className="flex mb-3 items-center gap-x-2">
        <div
          style={{ background: comment.expand.user.color }}
          className="w-[25px] h-[25px] flex items-center justify-center rounded-full"
        >
          {comment.expand.user.username.slice(0, 1).toLocaleUpperCase()}
        </div>
        <div className="flex w-full items-center justify-between pl-2">
          <p>
            {comment.expand.user.username}
          </p>
          <p className="text-[#ccc] text-xs">
            {faDataString(comment.created)}
          </p>
        </div>
      </div>
      <p className="">
        {comment.content}
      </p>
    </div>
  );
};

export default Comment;
