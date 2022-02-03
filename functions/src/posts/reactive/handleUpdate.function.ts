import { firestore } from "firebase-admin";
import { runWith } from "firebase-functions/v1";

export const handleUpdate = runWith({})
  .firestore.document("posts/{postId}")
  .onUpdate(async (snap, context) => {
    if (snap.before.data().reply_count === snap.after.data().reply_count)
      return;

    const workspace = snap?.after.data()?.owner_details?.email?.split("@")[1];
    if (!workspace) return;

    const users = await firestore()
      .collection("users")
      .where("workspace", "==", workspace)
      .get();

    return Promise.allSettled(
      users.docs.map(async (el) => {
        return el.ref.collection("unseen_posts").doc(snap?.after.id).update({
          reply_count: snap?.after.data().reply_count,
        });
      })
    );
  });
