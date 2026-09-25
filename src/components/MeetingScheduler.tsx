"use client";

import { useState } from "react";

type Props = {
  email?: string;
};

export default function MeetingScheduler({ email }: Props) {
  const [type, setType] = useState<"virtual" | "in-person">("virtual");
  const [name, setName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [company, setCompany] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  // Minimum date = tomorrow
  const minDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  })();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !time) {
      setStatus("error");
      setMsg("Please choose a date and time.");
      return;
    }
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: userEmail, company, date, time, type, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setStatus("ok");
      setMsg(
        data.emailSent
          ? "Meeting request sent. We received it and will confirm by email shortly."
          : "Meeting request saved. We will contact you soon."
      );
      setName("");
      setUserEmail("");
      setCompany("");
      setDate("");
      setTime("");
      setNotes("");
    } catch (err: any) {
      setStatus("error");
      setMsg(err.message || "Something went wrong");
    }
  }

  return (
    <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-1">Request a meeting</h3>
      <p className="text-sm text-slate-500 mb-6">
        Choose virtual or in-person, then enter your preferred date and time.
      </p>

      <form onSubmit={submit} className="space-y-4">
        {/* Type */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setType("virtual")}
            className={`text-sm font-medium py-2.5 rounded-lg border transition ${
              type === "virtual"
                ? "bg-teal-800 text-white border-teal-800"
                : "bg-white text-slate-600 border-slate-200 hover:border-teal-300"
            }`}
          >
            Virtual
          </button>
          <button
            type="button"
            onClick={() => setType("in-person")}
            className={`text-sm font-medium py-2.5 rounded-lg border transition ${
              type === "in-person"
                ? "bg-teal-800 text-white border-teal-800"
                : "bg-white text-slate-600 border-slate-200 hover:border-teal-300"
            }`}
          >
            In-person
          </button>
        </div>

        {/* Simple date + time */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Preferred date *</label>
            <input
              type="date"
              required
              min={minDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Preferred time *</label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none"
            />
            <p className="text-[10px] text-slate-400 mt-1">Your local time — we will confirm timezone by email</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Your name *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none"
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Email *</label>
            <input
              required
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none"
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Company</label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none"
            placeholder="Brand name"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm resize-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none"
            placeholder="Topics to discuss, product type..."
          />
        </div>

        {msg && (
          <p className={`text-sm ${status === "ok" ? "text-green-700" : "text-red-600"}`}>{msg}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-teal-800 hover:bg-teal-900 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition text-sm"
        >
          {status === "loading"
            ? "Sending..."
            : `Request ${type === "virtual" ? "virtual" : "in-person"} meeting`}
        </button>

        {email && (
          <p className="text-[11px] text-slate-400 text-center">
            Or email <a href={`mailto:${email}`} className="text-teal-700 hover:underline">{email}</a>
          </p>
        )}
      </form>
    </div>
  );
}
