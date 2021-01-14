import nookies from "nookies";
import { firebaseAdmin } from "./firebaseAdmin";

import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    // console.log(JSON.stringify(cookies, null, 2));
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    const { uid, email } = token;
    const user = token;

    // the user is authenticated!
    // FETCH STUFF HERE

    return {
      props: { message: `Your email is ${email} and your UID is ${uid}.`, user: user },
    };
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth",
      },
      props: {} as never,
    };
  }
};

export default getServerSideProps;