"use client";
import { useState, FormEvent } from "react";

const API_BASE = "/store/api";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
    };

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        form.reset();
      } else {
        setErrorMsg(json.message || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <label>
        <span>Name</span>
        <input type="text" name="name" placeholder="Name" required />
      </label>
      <label>
        <span>Email Address</span>
        <input type="email" name="email" placeholder="Email Address" required />
      </label>
      <label>
        <span>Phone Number</span>
        <input type="tel" name="phone" placeholder="Phone Number" />
      </label>
      <label>
        <span>Message</span>
        <textarea name="message" placeholder="Message" required />
      </label>

      {status === "success" && (
        <p className="form-success" role="status">Message sent successfully. We&apos;ll get back to you soon.</p>
      )}
      {status === "error" && (
        <p className="form-error" role="alert">{errorMsg}</p>
      )}

      <button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
