import * as trpcNext from '@trpc/server/adapters/next';
import {publicProcedure, router} from '~/server/trpc';
import * as addRoute from "../../../server/add";
import * as listRoute from "../../../server/list";
import {BUCKET_NAME, storageClient} from "~/utils/s3";
import {db,} from "~/utils/db";

const appRouter = router({
  add: publicProcedure
    .input(addRoute.Input)
    .mutation(({input}) => addRoute.handler(input, db, storageClient, BUCKET_NAME)),
  
  list: publicProcedure
    .input(listRoute.Input)
    .query(({input}) => listRoute.handler(input)),
});

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
