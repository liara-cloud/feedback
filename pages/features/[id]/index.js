import { Layout } from "@/components/Layout";
import { useRouter } from "next/router";
import React from "react";

const index = () => {
  const { query: { id } } = useRouter();

  return (
    <Layout>
      <main dir="rtl" className="mb-16 mx-auto max-w-4xl">
        <section className="pt-10">
          <p className="text-white">
            {id}
          </p>
        </section>
      </main>
    </Layout>
  );
};

export default index;
