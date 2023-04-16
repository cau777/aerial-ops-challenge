import {router} from "../trpc";
import {msgRouter} from "./msg";

export const appRouter = router({
  msg: msgRouter
});

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;