import * as firebaseAdmin from "firebase-admin";

const privateKey = `-----BEGIN PRIVATE KEY-----${JSON.parse(process.env["PRIVATE_KEY"]).p + "UHeC9E3B9wlaEe99qxCq2Ma9Qk0Y0ozfwGXGfc1ztDqLqiN8aDIjnq6hoMSj5sxA\nR0jgPCP+I5BVeuy7voNdIuiOQ9AiD3ZDFvbbMYWYP6AmDZzW2QBc6gaTGB5wDwnj\nRtHphSnhMACQJ6POBE7gVx2Ydu7JiAyrWKb2RtelAR9eJt3RuaOCjrds+xL0sdxL\ntBOIeU9VADjkTDiQJQzgzhbKxZp0RRs7g+6Tq7PSwwKBgQDm19omrVArBcxstwuk\n4FYCHM5FplhC3u9EQZjHj5ptWf0WnI05GBXBqPuIQtLSPBpXxFIiJy2rpUOpi6qL\nTRpPf1W3i+/fCUxlRrWIpTHbzYdKPNLVpQRPuUb/Wa9luSddmn8q7RcVdIcl8s/G\nH1tJjVJf8czUqbSjIP7mVByjcwKBgQC8LfqI1rgyM5+Rlv5LQXAweOt/JQep3zoT\nwgKxq28ODr3jJajAkxBg9w5cqztlLrWkCtoJwXLlzzsAjFFZmWBmAPmcEIH2l+Ya\n3j930zUseM3vte5/ASS1YmxGMaphue3yQtrjuM5sNrsSiloRNTv1dObVSDraQ7V0\nwDvWkCL34wKBgEugxiDLwSsHME0hvxfaQ3NXuqCI+fuWjC8Biqs+ueo/hDJHQeFF\nqcMTuKyQr/8en8bHU91KlqTYdQ1z64DN1uPapNuIZiLdKgE4JDtLW8VWVY+V08EY\n2gvAeKkp2dPq0CHTfvwyRtDJp4lgPn/7P+4d9bHnRyMZIkwbgEc3oVZPAoGBAJZ/\nt0VFZN9RhibsOch6N32s17tCJFTpoQs4OOtbjmARzjAiaEpL0+eY7zWSBNixeLgP\nrb3rpzbAfBG+JzmffwdVdEwqr6ZGadPHN79ffcFphFpYiLuucGtYofupsPijuPfu\nHB3QKddGFmuHluz4RFHVAuBE+jyhtjf/nlvFvxG9AoGASE3Em3rEStC65uPwgAWI\ns4VEPReY9EyN/EV4W6q1DfRd7GlXIadwyzTwVhpOTDLPBQ+btvLxK752+Nma64GC\nsuNwoe/iE+1vASUSx0FS9BR18xGiAao6qCnnvxmOzDD4EW/k6RcNBIHKQEUm7cZR\nXy3UIbZOI5NmdLQvo+SSzrM=\n\n"}-----END PRIVATE KEY-----`;
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