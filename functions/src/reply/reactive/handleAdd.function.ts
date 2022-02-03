import { firestore } from "firebase-admin";
import { runWith } from "firebase-functions/v1";

export const handleAdd = runWith({})
  .firestore.document("posts/{postId}/replies/{replyId}")
  .onCreate(async (snap, context) => {
    const postId = context.params.postId;
    const postRef = firestore().collection("posts").doc(postId);
    return postRef.update({
      reply_count: firestore.FieldValue.increment(1),
    });
  });
