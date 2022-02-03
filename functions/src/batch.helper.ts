import { firestore } from "firebase-admin";

//batch update, set, delete should be used when data volume starts getting bigger and bigger

type IProps = {
  ref: firestore.DocumentReference;
  method: string;
  data?: any;
};

export const firestoreBatchExecuter = async (payload: IProps[]) => {
  const batchList = [];
  let least_count = 0;
  // one batch can only have at max 500 items so limiting items to 495 per batch
  for (let i = 0; i < payload.length; i = i + 495) {
    const batchedData = payload.slice(least_count, i + 495);
    const batch = firestore().batch();
    for (let j = 0; j < batchedData.length; j++) {
      executeBatchItem(batch, batchedData[j]);
    }
    batchList.push(batch.commit());
    least_count = i + 495;
  }
  //only one awaiting point to run all batch concurently
  return Promise.allSettled(batchList);
};

const executeBatchItem = (batch: firestore.WriteBatch, payload: any) => {
  switch (payload?.method) {
    case "set":
      batch.set(payload?.ref, payload?.data);
      break;
    case "delete":
      batch.delete(payload?.ref);
      break;
    case "update":
      batch.update(payload?.ref, payload?.data);
      break;
    default:
      return;
  }
};
