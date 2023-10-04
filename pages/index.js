import { Layout } from "@/components/Layout";
import RoadmapItem from "@/components/RoadmapItem";

export default function Home() {
  return (
    <Layout>
      <main dir="rtl" className="mb-16 mx-auto max-w-4xl">
        <section className="pt-10">
          <div>
            <p className="text-[#86848d] text-sm">بازخورد‌ها</p>
            <div className="py-3 flex text-[#ccc] border-[#e4e2e444] justify-between px-4 w-1/3 border mt-3 rounded-md transition hover:border-[#e4e2e477] cursor-pointer">
              درخواست‌ها
              <span className="text-[#929292]">۳۴</span>
            </div>
          </div>
        </section>
        <section className="pt-10">
          <div>
            <p className="text-[#86848d] text-sm">مسیر</p>
          </div>
          <div className="flex gap-5 mt-3">
            {[
              { title: "در‌حال بررسی", color: "#85b5b5" },
              { title: "برنامه‌ریزی", color: "#1fa0ff" },
              { title: "در‌حال‌ انجام", color: "#c17aff" }
            ].map((item, i) =>
              <RoadmapItem key={i} color={item.color} title={item.title} />
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
}
