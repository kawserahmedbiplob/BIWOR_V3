"use client";

import { useEffect, useState } from "react";

type Props = {
  enabled?: boolean;
  text?: string;
  privacyUrl?: string;
};

export default function CookieConsent({
  enabled = true,
  text = "We use cookies to improve your experience and analyze site traffic. By continuing, you agree to our use of cookies.",
  privacyUrl = "/privacy",
}: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    try {
      const v = localStorage.getItem("biwor_cookie_consent");
      if (!v) setShow(true);
    } catch {
      setShow(true);
    }
  }, [enabled]);

  function accept() {
    try {
      localStorage.setItem("biwor_cookie_consent", "accepted");
    } catch {}
    setShow(false);
  }

  function decline() {
    try {
      localStorage.setItem("biwor_cookie_consent", "declined");
    } catch {}
    setShow(false);
  }

  if (!show || !enabled) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] p-4 md:p-6">
      <div className="max-w-3xl mx-auto bg-slate-900 text-white rounded-xl shadow-2xl p-5 md:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center border border-slate-700">
        <p className="text-sm text-slate-300 flex-1 leading-relaxed">
          {text}{" "}
          <a href={privacyUrl} className="underline text-white hover:text-teal-300">
            Privacy Policy
          </a>
        </p>
        <div className="flex gap-2 shrink-0">
          <button onClick={decline} className="text-sm px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800">
            Decline
          </button>
          <button onClick={accept} className="text-sm px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
