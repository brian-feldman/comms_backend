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

// using batch update/set but it is slow if the data are in small volume because it need to prepare for batching and all
// const var1 = users.docs
//     .filter((el) => el.id !== snap?.data()?.owner)
//     .map((el) => {
//       const unseenHandler = {
//         method: "set",
//         ref: el.ref.collection("unseen_posts").doc(snap?.id),
//         data: snap.data(),
//       };

//       return unseenHandler;
//     });

//   const var2 = users.docs
//     .filter((el) => el.id !== snap?.data()?.owner)
//     .map((el) => {
//       const countHandler = {
//         method: "update",
//         ref: el.ref,
//         data: {
//           unseen_posts: firestore.FieldValue.increment(1),
//         },
//       };

//       return countHandler;
//     });

//   return firestoreBatchExecuter([...var1, ...var2]);
