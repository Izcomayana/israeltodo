// lib/auth.ts
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebase";

export async function registerWithEmail({
  email,
  password,
  fullname,
}: {
  email: string;
  password: string;
  fullname: string;
}) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCred.user, { displayName: fullname });
  return userCred.user;
}
