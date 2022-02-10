import { firestore } from "firebase-admin";
import { runWith } from "firebase-functions/v1";

export const onAuth = runWith({})
  .auth.user()
  .onCreate(async (user) => {
    const { uid, displayName, email, photoURL } = user;
    const workspace = email?.split("@")[1];

    if (!workspace) return;

    const userRef = await firestore().collection("users").doc(uid).get();
    if (!userRef.exists) {
      await firestore().collection("users").doc(uid).set({
        workspace,
        email,
        display_name: displayName,
        photo_url: photoURL,
        unseen_posts: 0,
        notify_for_posts: true,
        created_at: firestore.FieldValue.serverTimestamp(),
        updated_at: firestore.FieldValue.serverTimestamp(),
      });
    }

    const isWorkspace = await firestore()
      .collection("workspace")
      .doc(workspace)
      .get();

    if (!isWorkspace.exists) {
      await firestore().collection("workspace").doc(workspace).set({
        workspace,
        owner: uid,
        created_at: firestore.FieldValue.serverTimestamp(),
        updated_at: firestore.FieldValue.serverTimestamp(),
      });
    }
  });
