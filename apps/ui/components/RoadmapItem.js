import React from "react";

const RoadmapItem = ({ title, color, content }) => {
  return (
    <div className="w-1/3 h-[500px] border border-[#e4e2e415] rounded-lg  overflow-hidden">
      <div className="p-[20px] border-b flex gap-2 text-[#ccc] border-[#e4e2e444] items-center bg-[#e4e2e409] border-b-[#e4e2e415]">
        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
        {title}
      </div>
      <div>
        <ul />
      </div>
    </div>
  );
};

export default RoadmapItem;
