import React, { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import TextField from "@/components/TextField";
import { toast } from "react-toastify";
import PocketBase from "pocketbase";


const pb = new PocketBase("https://feedback.iran.liara.run");


const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [metadata, setMetadata] = useState({});

  useEffect(() => {
    setIsLoading(true);
    if (typeof window !== "undefined") {
      const pb_auth = window.localStorage.getItem("pocketbase_auth");

      if (!pb_auth) return setIsLoading(false);

      const model = JSON.parse(pb_auth)?.model;


      setMetadata({
        id: model.id,
        email: model.email,
        username: model.username,
        color: model.color
      });
    }
    setIsLoading(false);
  }, []);


  const handleUpdate = async () => {
    setIsLoadingSubmit(true)
    const data = {
        "username": metadata.username,
        "color": metadata.color
    };
    
    try {
        const record = await pb.collection('users').update(metadata.id, data);
        
    } catch (error) {
        toast("ویرایش با خطا مواجه شد.")
    }
    setIsLoadingSubmit(false)
  }

  if(isLoading) return;

  return (
    <Layout>
      <main dir="rtl" className="mb-16 mx-auto max-w-4xl  text-white">
        <section className="px-7 md:px-0 pt-10">
          <div className="rounded-md bg-[#e4e2e407] p-4 text-sm font-thin">
            <h3 className="text-lg">تنظیمات اکانت</h3>
            <div className="mt-4 flex items-center gap-3">
              <div
                className="w-[35px] text-base h-[35px] flex items-center justify-center rounded-full"
                style={{ background: metadata.color }}
              >
                {metadata.username?.slice(0, 1).toLocaleUpperCase()}
              </div>

              <button className="h-[38px] cursor-pointer relative bg-[#e4e2e421] hover:opacity-80 transition  w-[100px] flex items-center justify-center rounded-md">
                <p dir="ltr">
                  {metadata.color}
                </p>
                <input
                  value={metadata.color}
                  type="color"
                  className="absolute z-10 h-full w-full opacity-0"
                  onChange={({ target }) =>
                    setMetadata({ ...metadata, color: target.value })}
                />
              </button>
            </div>
            <div className="mt-4">
              <TextField
                value={metadata.username}
                onChange={({ target }) =>
                  setMetadata({ ...metadata, username: target.value })}
                label="نام اکانت"
              />
            </div>
            <div className="mt-4">
              <TextField
                label="ایمیل"
                value={metadata.email}
                disabled
                classes={"opacity-50"}
              />
            </div>
            <div dir="ltr" className="mt-4">
              <button
                onClick={handleUpdate}
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
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Settings;
