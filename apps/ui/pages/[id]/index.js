import { Layout } from "@/components/Layout";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import PocketBase from "pocketbase";
import { ArrowTopIcon } from "@/components/svgs/features";
import FeatureSkeleton from "@/components/FeatureSkeleton";
import faDataString from "@/utils/faDataString";
import CreateComment from "@/components/CreateComment";
import { toast } from "react-toastify";
import Comment from "@/components/Comment";

const pb = new PocketBase("https://feedback.iran.liara.run");

const index = () => {
  const { query: { id } } = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [vote, setVote] = useState(0);
  const [feature, setFeature] = useState({});

  const fetchFeatureById = async id => {
    try {
      setIsLoading(true);
      const feature = await pb.collection("features").getOne(id, {
        expand: "user"
      });

      setVote(feature.votes.length);

      const attachment = pb.files.getUrl(feature, feature.attachment);

      setFeature(feature);
      if (attachment) {
        setAttachment(attachment);
      }
    } catch (error) {
      toast("خطا در دریافت اطلاعات")
    }
    setIsLoading(false);
  };


  const isLogin = () => {
    if (typeof window === "undefined") return;

    const pb_auth = window.localStorage.getItem("pocketbase_auth");
    const model = JSON.parse(pb_auth)?.model;

    return model?.id ? true : false
  }


  const toggleVote = async () => {
    if (typeof window === "undefined") return;

    if(!isLogin()) {
      return toast("لطفا ابتدا لاگین کنید.");
    }

    const pb_auth = window.localStorage.getItem("pocketbase_auth");
    const model = JSON.parse(pb_auth).model;

    const data = {
      feature: id,
      user: model.id
    };

    try {

      const record = await pb.collection("votes").create(data);
      setVote(vote + 1);

      await pb.collection("features").update(data.feature, {
        "votes+": record.id
      });

    } catch (error) {

      const findVote = await pb.collection("votes").getList(1, null, {
        filter: `feature="${id}" && user="${model.id}"`
      });

      const voteID = findVote?.items?.shift()?.id;

      await pb.collection("features").update(id, {
        "votes-": voteID
      });

      setVote(vote -1);

      await pb.collection("votes").delete(voteID);
    }
  };


  const handleSubmitComment = async (e, content) => {
    e.preventDefault();

    if (typeof window === "undefined") return;

    if(!isLogin()) {
      return toast("لطفا ابتدا لاگین کنید.");
    }

    const pb_auth = window.localStorage.getItem("pocketbase_auth");
    const model = JSON.parse(pb_auth).model;

    const data = {
      feature: id,
      user: model.id,
      content
    };
    setIsLoadingComment(true);

    try {
      await pb.collection("comments").create(data);
      await fetchComments(id);
      toast("ثبت نظر با موفقیت انجام شد.");
      setIsLoadingComment(false);
    } catch (error) {
      toast("ثبت نظر با خطا مواجه شد.");
      setIsLoadingComment(false);
    }
  };

  const fetchComments = async id => {
    try {
      const resultList = await pb.collection("comments").getList(1, null, {
        filter: `feature="${id}"`,
        expand: "user"
      });

      setComments(resultList.items);
    } catch (error) {
      toast("خطا در دریافت اطلاعات")
    }
  };

  useEffect(
    () => {
      if (id) {
        fetchFeatureById(id);
        fetchComments(id);
      }
    },
    [id]
  );

  return (
    <Layout>
      <main dir="rtl" className="mb-16 mx-auto max-w-4xl px-7 md:px-0  text-white">
        <section className="pt-10">
          {isLoading && <FeatureSkeleton rows={12} />}
          {!isLoading &&
            feature.title &&
            <Fragment>
              <div className="flex flex-col-reverse md:flex-row  justify-between">
                <div className="text-[#ccc] w-full pointer mb-6 flex gap-x-4">
                  <div
                    onClick={toggleVote}
                    className="text-white cursor-pointer text-center font-light text-xl px-4 py-1 rounded-lg h-[48px] border border-[#e4e2e415] bg-[#e4e2e409]"
                  >
                    <ArrowTopIcon />
                    {vote}
                  </div>
                  <div className="w-full">
                    <div className="flex mb-3 items-center gap-x-2 font-light text-sm ">
                      <div style={{ background: feature.expand.user.color  }} className="w-[25px] h-[25px] flex items-center justify-center rounded-full">
                        {feature.expand.user.username
                          ?.slice(0, 1)
                          .toLocaleUpperCase()}
                      </div>
                      <p>
                        {feature.expand.user.username}
                      </p>
                    </div>
                    <h3 className="font-normal text-lg">
                      {feature.title}
                    </h3>
                    <p
                      className="text-sm font-light"
                      style={{ lineHeight: "26px" }}
                    >
                      {feature.content}
                    </p>

                    <CreateComment
                      onSubmit={handleSubmitComment}
                      isLoading={isLoadingComment}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-x-1 font-light text-sm ">
                    <p className="ml-3 text-xs whitespace-nowrap">
                      {" "}تاریخ ایجاد:
                    </p>
                    <p className="">
                      {faDataString(feature.created)}
                    </p>
                  </div>
                  {attachment &&
                    <a
                      download
                      target="_blank"
                      href={attachment}
                      className="my-1 transition text-[#ccc] border py-1 px-3 rounded-md border-[#e4e2e422] hover:bg-[#e4e2e406] text-xs"
                    >
                      دانلود پیوست
                    </a>}
                </div>
              </div>
              <div />

              <div className=" mx-7 md:mr-[65px] md:ml-[145px] border-t border-t-[#e4e2e422] pt-4">
                {comments.map(comment =>
                  <Comment key={comment.id} comment={comment} />
                )}
              </div>
            </Fragment>}
        </section>
      </main>
    </Layout>
  );
};

export default index;
