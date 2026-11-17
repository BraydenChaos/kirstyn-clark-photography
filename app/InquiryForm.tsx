"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { submitInquiry } from "./inquire/actions";
import { sessionTypes, type Field, type InquiryState } from "./inquire/shared";

const initial: InquiryState = { status: "idle" };

/** Today as YYYY-MM-DD in the visitor's time zone, for the date picker's min. */
const today = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

export default function Inquiry() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Bumped on every open after a success, so the form remounts empty.
  const [session, setSession] = useState(0);
  const [open, setOpen] = useState<{ startedAt: number; token: string; min: string } | null>(null);

  const show = () => {
    setOpen({ startedAt: Date.now(), token: crypto.randomUUID(), min: today() });
    dialogRef.current?.showModal();
  };

  return (
    <>
      <button type="button" className="inquire-btn" onClick={show}>
        Inquire
      </button>

      <dialog
        ref={dialogRef}
        className="inquiry"
        aria-labelledby="inquiry-title"
        onClose={() => setSession((s) => s + 1)}
        // Clicking the backdrop (the dialog element itself, outside the panel) closes it.
        onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
      >
        <div className="inquiry__panel">
          <button
            type="button"
            className="inquiry__close"
            aria-label="Close"
            onClick={() => dialogRef.current?.close()}
          >
            &times;
          </button>
          {open && <InquiryBody key={session} {...open} />}
        </div>
      </dialog>
    </>
  );
}

function InquiryBody({ startedAt, token, min }: { startedAt: number; token: string; min: string }) {
  const [state, action, pending] = useActionState(submitInquiry, initial);
  const formRef = useRef<HTMLFormElement>(null);

  const err = state.status === "error" ? state.fieldErrors : {};
  const val = state.status === "error" ? state.values : {};

  useEffect(() => {
    if (state.status === "error")
      formRef.current?.querySelector<HTMLElement>("[aria-invalid]")?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div className="inquiry__done" role="status">
        <h2 id="inquiry-title" className="inquiry__title">
          Thank you, {state.firstName}.
        </h2>
        <p>
          Your inquiry is on its way. I&rsquo;ve sent a confirmation to your inbox and
          I&rsquo;ll be in touch within 48 hours.
        </p>
      </div>
    );
  }

  const field = (name: Field) => {
    const message = err[name];
    return {
      id: `inq-${name}`,
      name,
      defaultValue: val[name] ?? "",
      "aria-invalid": message ? true : undefined,
      "aria-describedby": message ? `inq-${name}-err` : undefined,
    };
  };
  const errorFor = (name: Field) =>
    err[name] ? (
      <span id={`inq-${name}-err`} className="inquiry__error">
        {err[name]}
      </span>
    ) : null;

  return (
    <form ref={formRef} action={action} className="inquiry__form">
      <h2 id="inquiry-title" className="inquiry__title">
        Inquire
      </h2>
      <p className="inquiry__lede">Tell me a little about what you have in mind.</p>

      <input type="hidden" name="startedAt" value={startedAt} />
      <input type="hidden" name="token" value={token} />
      {/* Honeypot: hidden from people and screen readers, irresistible to bots. */}
      <div className="inquiry__hp" aria-hidden="true">
        <label>
          Company <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="inquiry__row">
        <label className="inquiry__field">
          <span>First name</span>
          <input type="text" autoComplete="given-name" required maxLength={80} {...field("firstName")} />
          {errorFor("firstName")}
        </label>
        <label className="inquiry__field">
          <span>Last name</span>
          <input type="text" autoComplete="family-name" required maxLength={80} {...field("lastName")} />
          {errorFor("lastName")}
        </label>
      </div>

      <label className="inquiry__field">
        <span>Email</span>
        <input type="email" autoComplete="email" required maxLength={254} {...field("email")} />
        {errorFor("email")}
      </label>

      <label className="inquiry__field">
        <span>Phone number</span>
        <input type="tel" autoComplete="tel" required maxLength={30} {...field("phone")} />
        {errorFor("phone")}
      </label>

      <div className="inquiry__row">
        <label className="inquiry__field">
          <span>Session type</span>
          <select required {...field("sessionType")}>
            <option value="" disabled>
              Choose one
            </option>
            {sessionTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errorFor("sessionType")}
        </label>
        <label className="inquiry__field">
          <span>
            Preferred date <em>(optional)</em>
          </span>
          <input type="date" min={min} {...field("preferredDate")} />
          {errorFor("preferredDate")}
        </label>
      </div>

      {state.status === "error" && (
        <p className="inquiry__alert" role="alert">
          {state.message}
        </p>
      )}

      <button type="submit" className="inquiry__submit" disabled={pending}>
        {pending ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
