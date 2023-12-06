import React from "react";

const FeatureSkeleton = ({ rows = 2 }) => {
  return (
    <div className="animate-pulse mb-5">
      <div className="mb-6 flex gap-x-4">
        <div className="h-[48px] bg-gray-200 rounded-lg dark:bg-gray-700 w-[48px]" />
        <div className="w-full">
          <div className="h-3 bg-gray-200 rounded-sm dark:bg-gray-700 w-1/3 mt-1 mb-3" />
          {new Array(rows)
            .fill(0)
            .map(() =>
              <div className="h-2 bg-gray-200 opacity-60 rounded-sm dark:bg-gray-700 mb-2" />
            )}
        </div>
      </div>
    </div>
  );
};

export default FeatureSkeleton;
