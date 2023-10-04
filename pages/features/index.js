import { Layout } from "@/components/Layout";
import { ArrowTopIcon } from "@/components/svgs/features";
import Link from "next/link";
import React from "react";

const features = () => {
  return (
    <Layout>
      <main dir="rtl" className="mb-16 mx-auto max-w-4xl">
        <div className="flex mt-10 relative text-sm font-thin gap-x-8">
          <div className="w-1/3 sticky top-10  h-[max-content] text-[#ccc] border border-[#e4e2e415] bg-[#e4e2e409] rounded-lg p-5">
            <h3 className="text-white mb-2">یک ویژگی را پیشنهاد کنید</h3>
            <p className="text-xs text-[#a1a1a1]  mb-4">
              لورم ایپسوم متن ساختگی است با تولید سادگی نامفهوم از صنعت چاپ
            </p>
            <form>
              <label>عنوان</label>
              <input className="w-full my-1 bg-transparent py-2 rounded-md px-2 border outline-none border-[#e4e2e444]" />
              <label>توضیحات</label>
              <textarea className="w-full mt-1 bg-transparent py-2 rounded-md px-2 border outline-none border-[#e4e2e444]" />
              <button
                className="py-2 text-[#111] font-normal w-full mt-2 rounded-md transition hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(92deg, rgb(135, 252, 196) 0%, rgb(40, 193, 245) 98.77%)"
                }}
              >
                ثبت
              </button>
            </form>
          </div>
          <div className="w-2/3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(item =>
              <Link
                href={`/features/${item}`}
                className="text-[#ccc] pointer mb-6 flex gap-x-4"
              >
                <div className="text-white font-light text-xl px-4 py-1 rounded-lg h-[48px] border border-[#e4e2e415] bg-[#e4e2e409]">
                  <ArrowTopIcon />
                  23
                </div>
                <div>
                  <h3 className="font-normal text-white text-lg">
                    مانیتورینگ پیشرفته در کنسول
                  </h3>
                  <span className="text-[#85b5b5]">در حال بررسی</span>
                  <p className="text-white" style={{ lineHeight: "26px" }}>
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و
                    با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه
                    و مجله در ستون و سطرآنچنان که لازم است
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default features;
