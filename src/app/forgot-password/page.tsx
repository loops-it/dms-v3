/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Paragraph from "@/components/common/Paragraph";
import { useCompanyProfile } from "@/context/userCompanyProfile";
import { Input } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { API_BASE_URL } from "@/utils/apiClient";
import ToastMessage from "@/components/common/Toast";
const page = () => {
    const { data } = useCompanyProfile();
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<"success" | "error">("success");
    const [toastMessage, setToastMessage] = useState("");
    const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    const validationErrors: { email?: string; password?: string } = {};
    if (!email) validationErrors.email = "Email is required";
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try { 
      const formData = new FormData();
      formData.append("email", email);

      const response = await fetch(`${API_BASE_URL}forgot-password`, {
              method: "POST",
              body: formData,
      })

      const data_fp = await response.json();
      console.log("API Response:", data_fp);

      if (data_fp.status === "success") {
        setToastType("success");
        setToastMessage("Password reset link has been sent to your email");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      } else if (data_fp.status === "fail") {
        setToastType("error");
        setToastMessage("Failed to send the link.");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error during reset:", error);
    } finally {
      setLoading(false);
    }
  };
  const imageUrl = data?.logo_url || '/logo.png';
  const bannerUrl = data?.banner_url || '/login-image.png';
  return (
    <>
      <div
        className="d-flex flex-column flex-lg-row-reverse w-100"
        style={{ minHeight: "100svh", maxHeight: "100svh" }}
      >
        <div
          className="col-12 col-lg-8 d-none d-lg-block"
          style={{
            minHeight: "100svh",
            maxHeight: "100svh",
            backgroundColor: "#EBF2FB",
          }}
        >
          <Image
            src={bannerUrl}
            alt=""
            width={1000}
            height={800}
            className="img-fluid"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <div
          className="col-12 col-md-6 align-self-center  col-lg-4 px-4 px-lg-5 d-flex flex-column justify-content-center align-items-center"
          style={{ minHeight: "100svh", maxHeight: "100svh" }}
        >
          <Image
            src={imageUrl}
            alt=""
            width={200}
            height={150}
            objectFit="cover"
            className="img-fluid mb-3 mb-lg-4 loginLogo"
          />
          <h3 className="mb-0">Forgotten Password ?</h3>
          <Paragraph
            text="Enter your email to reset your password"
            color="Paragraph"
          />
          <form
            className="d-flex flex-column px-0 px-lg-3 mt-3 mt-lg-4"
            style={{ width: "100%" }}
            onSubmit={handleLogin}
          >
            <div className="d-flex flex-column">
              <div className="d-flex flex-column mt-3">
                <Input type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`mb-3 ${errors.email ? "is-invalid" : ""}`} />
                {errors.email && (
                  <div className="text-danger">{errors.email}</div>
                )}
              </div>

              <div className="d-flex flex-row align-items-center">
                <p className="mb-0 me-2">Want to login ? </p>
                <Link
                  href="/login"
                  style={{
                    fontSize: "14px",
                    color: "#333",
                    textDecoration: "none",
                  }}
                  className="py-3 d-flex align-self-end"
                >
                  Log in
                </Link>
              </div>
              <button type="submit" className="loginButton text-white" disabled={loading}>
                {loading ? "Loading..." : "Reset My Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastMessage
          message={toastMessage}
          show={showToast}
          onClose={() => setShowToast(false)}
          type={toastType}
        />
    </>
  );
};

export default page;
