import * as addRoute from "../msg/add";
import * as listRoute from "../msg/list";
import * as deleteRoute from "../msg/delete";
import {publicProcedure, router} from "../trpc";
import {db} from "../utils/db";
import {BUCKET_NAME, storageClient} from "../utils/s3";

export const msgRouter = router({
  add: publicProcedure
    .input(addRoute.ZInput)
    // Dependencies are injected as arguments to the handlers
    .mutation(({input}) => addRoute.handler(input, db, storageClient, BUCKET_NAME)),
  
  list: publicProcedure
    .input(listRoute.ZInput)
    .query(({input}) => listRoute.handler(input, db)),
  
  delete: publicProcedure
    .input(deleteRoute.ZInput)
    .mutation(({input}) => deleteRoute.handle(input, db, storageClient, BUCKET_NAME)),
});