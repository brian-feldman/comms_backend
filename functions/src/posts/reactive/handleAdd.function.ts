import { firestore } from "firebase-admin";
import { runWith } from "firebase-functions/v1";

export const handleAdd = runWith({})
  .firestore.document("posts/{postId}")
  .onCreate(async (snap, context) => {
    const workspace = snap?.data()?.owner_details?.email?.split("@")[1];
    if (!workspace) return;

    const users = await firestore()
      .collection("users")
      .where("workspace", "==", workspace)
      .get();

    return Promise.allSettled(
      users.docs.map(async (el) => {
        if (el.id === snap?.data()?.owner) return;
        await el.ref.update({
          unseen_posts: firestore.FieldValue.increment(1),
        });
        return el.ref.collection("unseen_posts").doc(snap.id).set(snap.data());
      })
    );
  });
