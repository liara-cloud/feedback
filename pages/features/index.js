import { Layout } from "@/components/Layout";
import { ArrowTopIcon, UploadIcon } from "@/components/svgs/features";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import PocketBase from "pocketbase";
import { toast } from "react-toastify";
import FeatureSkeleton from "@/components/FeatureSkeleton";
import TextField from "@/components/TextField";
import { GoogleIcon } from "@/components/svgs/header";

const pb = new PocketBase("https://feedback.iran.liara.run");

const initForm = {
  title: "",
  content: "",
  attachment: undefined
};

//  TODO: HANDLE UPLOAD PNG AND JPG FILE

const features = () => {
  const [form, setForm] = useState(initForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGetfeatures, setIsLoadingGetfeatures] = useState(true);
  const [votes, setVotes] = useState({});

  const [features, setFeatures] = useState([]);


  const isLogin = () => {
    if (typeof window === "undefined") return;

    const pb_auth = window.localStorage.getItem("pocketbase_auth");
    const model = JSON.parse(pb_auth)?.model;

    return model?.id ? true : false
  }

  const featchFeatures = async () => {
    setIsLoadingGetfeatures(true);
    try {
      const records = await pb.collection("features").getFullList({
        sort: "-created"
      });

      const votes = await records.map(item => ({
        [item.id]: item.votes.length
      }));
      setVotes(Object.assign({}, ...votes));

      setFeatures(records);

      setIsLoadingGetfeatures(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    featchFeatures();
  }, []);

  const toggleVote = async featureID => {
    if (typeof window === "undefined") return;

    if(!isLogin()) {
      return toast("لطفا ابتدا لاگین کنید.");
    }

    const pb_auth = window.localStorage.getItem("pocketbase_auth");
    const model = JSON.parse(pb_auth).model;

    const data = {
      feature: featureID,
      user: model.id
    };

    try {

      const record = await pb.collection("votes").create(data);
      setVotes({...votes, [featureID]: votes[featureID] + 1 })

      await pb.collection("features").update(data.feature, {
        "votes+": record.id
      });

    } catch (error) {

      const findVote = await pb.collection("votes").getList(1, null, {
        filter: `feature="${featureID}" && user="${model.id}"`
      });

      const voteID = findVote?.items.shift()?.id;

      await pb.collection("features").update(featureID, {
        "votes-": voteID
      });

      setVotes({...votes, [featureID]: votes[featureID] - 1 })

      await pb.collection("votes").delete(voteID);
    }
  };

  const handleSubmit = async e => {
    setIsLoading(false);
    e.preventDefault();

    if(!isLogin()) {
      return toast("لطفا ابتدا لاگین کنید.");
    }

    const { title, content, attachment } = form;

    const user =
      typeof window !== "undefined" &&
      JSON.parse(localStorage.getItem("pocketbase_auth")).model.id;

    try {
      await pb.collection("features").create({
        title,
        content,
        user,
        attachment
      });

      featchFeatures();
      setForm(initForm);
      setIsLoading(false);
      toast("درخواست شما با موفقیت ثبت شد.");
    } catch (error) {
      setIsLoading(false);
      toast("درخواست شما با خطا مواجه شد.");
    }
  };

  const handleFileUpload = event => {
    const attachment = event.target.files[0];
    setForm({ ...form, attachment });
  };

  return (
    <Layout>
      <main dir="rtl" className="mb-16 mx-auto max-w-4xl">
        <div className="md:flex mt-10 px-7 md:px-0 relative text-sm font-thin gap-x-8">
          <div className="md:w-1/3 relative md:sticky top-10 h-[max-content] text-[#ccc] border border-[#e4e2e415] bg-[#e4e2e409] rounded-lg p-5">

            <h3 className="text-white mb-2">یک ویژگی را پیشنهاد کنید</h3>
            <p className="text-xs text-[#a1a1a1] mb-4">
              لورم ایپسوم متن ساختگی است با تولید سادگی نامفهوم از صنعت چاپ
            </p>
            <form onSubmit={handleSubmit}>
              <TextField
                label={"عنوان"}
                value={form.title}
                onChange={({ target }) =>
                  setForm({ ...form, title: target.value })}
              />
              <div className="my-2">
                <TextField
                  as="textarea"
                  label={"توضیحات"}
                  rows={4}
                  value={form.content}
                  onChange={({ target }) =>
                    setForm({ ...form, content: target.value })}
                />
              </div>
              <div className="flex mt-1 items-center justify-between">
                <div className="flex gap-2 items-center">
                  <button className="h-[38px]  relative bg-[#e4e2e412] hover:opacity-80 transition  w-[38px] flex items-center justify-center  border border-[#e4e2e444] rounded-md">
                    <UploadIcon />
                    <input
                      type="file"
                      className="absolute z-10 h-full w-full opacity-0"
                      onChange={handleFileUpload}
                    />
                  </button>
                  <div dir="ltr">
                    {form.attachment?.name.length >= 8
                      ? form.attachment?.name.slice(0, 8) + "..."
                      : form.attachment?.name}
                  </div>
                </div>
                <button
                  type="submit"
                  className="py-2 text-[#111] px-5 font-normal rounded-md"
                  style={{
                    background:
                      "linear-gradient(92deg, rgb(135, 252, 196) 0%, rgb(40, 193, 245) 98.77%)",
                    opacity: isLoading ? 0.2 : 1
                  }}
                >
                  {isLoading ? "درحال ثبت..." : "ثبت"}
                </button>
              </div>
            </form>
          </div>
          <div className="md:w-2/3 mt-10 md:mt-0">
            {isLoadingGetfeatures &&
              new Array(8).fill(0).map(() => <FeatureSkeleton />)}

            {!isLoadingGetfeatures &&
              features.map(item =>
                <div className="text-[#ccc] pointer mb-6 flex gap-x-4">
                  <div
                    onClick={() => toggleVote(item.id)}
                    className="text-white text-center font-light cursor-pointer text-xl px-4 py-1 rounded-lg h-[48px] border border-[#e4e2e415] bg-[#e4e2e409]"
                  >
                    <ArrowTopIcon />
                    {votes[item.id]}
                  </div>
                  <Link href={`/features/${item.id}`}>
                    <div>
                      <h3 className="font-normal text-white text-lg">
                        {item.title}
                      </h3>
                      <p className="text-white" style={{ lineHeight: "26px" }}>
                        {item.content.length > 200
                          ? `${item.content.slice(0, 200)}...`
                          : item.content}
                      </p>
                    </div>
                  </Link>
                </div>
              )}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default features;
