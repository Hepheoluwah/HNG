import { openDB } from "idb";

const DB_NAME = "AttendeeDB";
const STORE_NAME = "attendee";

export const getDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

export const saveToDB = async (key, value) => {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    await tx.store.put(value, key);
    await tx.done;
  } catch (error) {
    console.error("Error saving to DB:", error);
  }
};

export const getFromDB = async (key) => {
  try {
    const db = await getDB();
    return await db.get(STORE_NAME, key);
  } catch (error) {
    console.error("Error getting data from DB:", error);
  }
};

export const resetDB = async () => {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    await tx.store.clear();
    await tx.done;
  } catch (error) {
    console.error("Error resetting DB:", error);
  }
};
