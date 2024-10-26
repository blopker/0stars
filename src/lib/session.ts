import { useSession } from "vinxi/http";
export async function getUser() {
  const session = await useSession({
    password: process.env.SESSION_SECRET!,
  });
  //   console.log(session.id);
  return session;
}
