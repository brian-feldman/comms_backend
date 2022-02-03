import { firestore } from "firebase-admin";
import { runWith } from "firebase-functions/v1";

export const handleUnseenPostDelete = runWith({})
  .firestore.document("users/{userId}/unseen_posts/{uspId}")
  .onDelete(async (snap, context) => {
    const userId = context.params.userId;
    const userRef = firestore().collection("users").doc(userId);
    return userRef.update({
      unseen_posts: firestore.FieldValue.increment(-1),
    });
  });
