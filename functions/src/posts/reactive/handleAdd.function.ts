import { runWith } from "firebase-functions/v1";

export const handleAdd = runWith({})
  .firestore.document("posts/{postId}")
  .onCreate(async (snap, context) => {
    // const post = snap.data();
    // const postId = context.params.postId;
  });
