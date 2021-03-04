import * as firebaseAdmin from "firebase-admin";

const { pk } = JSON.parse(process.env["PK"]);
const clientEmail = `firebase-adminsdk-28q7g@learn-to-code-nz.iam.gserviceaccount.com`;
const projectId = "learn-to-code-nz";

if (!pk || !clientEmail || !projectId) {
  console.log(
    `Failed to load Firebase credentials. Follow the instructions in the README to set your Firebase credentials inside environment variables.`
  );
}

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      privateKey: pk,
      clientEmail,
      projectId,
    }),
    databaseURL: `https://${projectId}.firebaseio.com`,
  });
}

export { firebaseAdmin };