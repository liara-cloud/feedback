import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import PocketBase from "pocketbase";
import {
  ArrowIcon,
  ChangeLogIcon,
  GoogleIcon,
  RoadmapIcon,
  FeatureIcon
} from "./svgs/header";
import createRandomHexColor from "@/utils/createRandomColor";

const pb = new PocketBase("https://feedback.iran.liara.run/");

function Header() {
  const { pathname } = useRouter();
  const [isValidLogin, setIsValidLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [metadata, setMetadata] = useState({ avatar: "", email: "" });

  useEffect(() => {
    setIsLoading(true);
    if (typeof window !== "undefined") {
      const pb_auth = window.localStorage.getItem("pocketbase_auth");

      if (!pb_auth) return setIsLoading(false);

      const model = JSON.parse(pb_auth)?.model;

      setMetadata({ email: model.email, color: model.color });
    }
    setIsLoading(false);
  }, []);

  const handleLoginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const authData = await pb
        .collection("users")
        .authWithOAuth2({ provider: "google" });


      if (!authData.record.color) {
        const data = {
          color: createRandomHexColor()
        };
        await pb.collection("users").update(authData.record.id, data);
      }

      if (pb.authStore.isValid) {
        setMetadata(authData.record);
        setIsValidLogin(pb.authStore.isValid);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleShowMenu = () => {
    setShowMenu(true);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  const handleLogout = () => {
    pb.authStore.clear();
    setShowMenu(false);
    setMetadata({});
    setIsValidLogin(false);
  };

  return (
    <Fragment>
      <header dir="rtl" className="mx-auto relative max-w-4xl px-5 md:px-0 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <img src="/liara.svg" width={70} />
          </div>

          {showMenu &&
            <Fragment>
              <div
                className="w-full h-full t-0 left-0 fixed z-[0]"
                onClick={handleCloseMenu}
              />
              <div className="absolute border z-10 border-[#e4e2e415] bg-[#222832] rounded-lg w-[110px] p-2 top-[50px] left-[20px]">
                <ul className="text-[#ccc] text-sm">
                  <li className="border-b pb-1 cursor-pointer hover:opacity-80 transition border-b-[#cccccc22]">
                    <Link href="/settings">ویرایش</Link>
                  </li>
                  <li
                    onClick={handleLogout}
                    className="pt-1 cursor-pointer hover:opacity-80 transition"
                  >
                    خروج
                  </li>
                </ul>
              </div>
            </Fragment>}

          {isValidLogin || metadata.email
            ? <Fragment>
                <div
                  onClick={handleShowMenu}
                  dir="ltr"
                  className="h-[35px] flex gap-1 items-center cursor-pointer transition hover:opacity-80"
                >
                  <p className="text-[#ccc] font-light text-sm">
                    حساب‌کاربری
                  </p>
                  <ArrowIcon />
                </div>
              </Fragment>
            : <div className="h-[35px]">
                <button
                  onClick={handleLoginWithGoogle}
                  style={{ opacity: isLoading ? 0.3 : 1 }}
                  className="flex items-center text-[#ccc] border-[#e4e2e422] text-sm gap-x-2 py-2 px-3 border  md:mt-3 rounded-md transition hover:border-[#e4e2e444] cursor-pointer"
                >
                  <GoogleIcon />
                  ورود‌ به حساب‌کاربری
                </button>
              </div>}
        </div>
        <div className="flex gap-x-5 mt-6">
          <Link
            href="/"
            className="font-thin flex items-center gap-x-1"
            style={{ color: pathname === "/" ? "#03A9F4" : "#ccc" }}
          >
            <RoadmapIcon />
            مسیر
          </Link>
          <Link
            href="/features"
            className="flex font-thin items-center gap-x-1"
            style={{ color: pathname === "/features" ? "#03A9F4" : "#ccc" }}
          >
            <FeatureIcon />
            درخواست‌ها
          </Link>
          <Link
            href="/changelog"
            className="flex font-thin items-center gap-x-1"
            style={{ color: pathname === "/changelog" ? "#03A9F4" : "#ccc" }}
          >
            <ChangeLogIcon />
            تاریخچه‌تغییرات
          </Link>
        </div>
      </header>
      <div className="w-full h-[1px] bg-[#e4e2e422]" />
    </Fragment>
  );
}

export default Header;
