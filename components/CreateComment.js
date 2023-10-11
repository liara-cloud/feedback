import React, { useState } from "react";
import PocketBase from "pocketbase";
import TextField from "./TextField";

const CreateComment = ({ onSubmit, isLoading }) => {
  const [content, setContent] = useState("");

  return (
    <form
      onSubmit={async e => {
        await onSubmit(e, content);
        setContent("");
      }}
      className="text-sm mt-8 flex items-center gap-2"
    >
      <TextField
        value={content}
        onChange={({ target: { value } }) => setContent(value)}
        placeholder="نظر خود را وارد کنید"
      />

      <button
        type="submit"
        className="py-2 whitespace-nowrap text-[#111] px-5 font-normal rounded-md"
        style={{
          background:
            "linear-gradient(92deg, rgb(135, 252, 196) 0%, rgb(40, 193, 245) 98.77%)",
          opacity: isLoading ? 0.5 : 1
        }}
      >
        ثبت نظر
      </button>
    </form>
  );
};

export default CreateComment;
