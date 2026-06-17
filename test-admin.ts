import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp({ projectId: config.projectId });
const db = getFirestore(app, config.firestoreDatabaseId);

async function test() {
  await db.collection("test").add({ msg: "hello" });
  const snapshot = await db.collection("test").get();
  console.log("Docs:", snapshot.docs.length);
}
test().catch(console.error);
