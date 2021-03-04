import * as firebaseAdmin from "firebase-admin";

const { privateKey } = JSON.parse(process.env["FIREBASE_PRIVATE_KEY"]);
const clientEmail = `firebase-adminsdk-28q7g@learn-to-code-nz.iam.gserviceaccount.com`;
const projectId = "learn-to-code-nz";

if (!privateKey || !clientEmail || !projectId) {
  console.log(
    `Failed to load Firebase credentials. Follow the instructions in the README to set your Firebase credentials inside environment variables.`
  );
}

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      privateKey: privateKey,
      clientEmail,
      projectId,
    }),
    databaseURL: `https://${projectId}.firebaseio.com`,
  });
}

export { firebaseAdmin };