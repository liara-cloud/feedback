import React, { Fragment } from "react";

const TextField = ({ label, classes, as = "input", ...other }) => {
  if (as === "textarea") {
    return (
      <Fragment>
        {label &&
          <label>
            {label}
          </label>}
        <textarea
          className={`w-full mt-1 bg-transparent py-2 rounded-md px-2 border outline-none border-[#e4e2e444] ${classes}`}
          {...other}
        />
      </Fragment>
    );
  }

  return (
    <Fragment>
      {label &&
        <label>
          {label}
        </label>}
      <input
        className={`w-full my-1 bg-transparent py-2 rounded-md px-2 border outline-none border-[#e4e2e444] ${classes}`}
        {...other}
      />
    </Fragment>
  );
};

export default TextField;
