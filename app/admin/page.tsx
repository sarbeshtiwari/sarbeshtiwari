import type { Metadata } from "next";
import { adminConfigured, isAdmin } from "../lib/adminAuth";
import { currentResume, storeConfigured } from "../lib/resumeStore";
import { dbConfigured, listMessages, type Message } from "../lib/messages";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function Admin() {
  const signedIn = await isAdmin();
  let resume = null;
  let storeError = false;
  let messages: Message[] = [];
  let dbError = false;
  if (signedIn && dbConfigured()) {
    try {
      messages = await listMessages();
    } catch {
      dbError = true;
    }
  }
  if (signedIn && storeConfigured()) {
    try {
      resume = await currentResume();
    } catch {
      storeError = true;
    }
  }
  return (
    <div className="sketch-page">
      <header className="sketch-header">
        <p className="kicker">ADMIN · ONLY SARBESH</p>
        <h1>
          the <span className="ink-mark">back office</span>.
        </h1>
      </header>
      <AdminClient
        configured={adminConfigured()}
        storeReady={storeConfigured() && !storeError}
        signedIn={signedIn}
        initialResume={resume}
        dbReady={dbConfigured() && !dbError}
        initialMessages={messages}
      />
    </div>
  );
}
