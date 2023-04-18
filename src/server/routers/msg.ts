import * as addRoute from "../msg/add";
import * as listRoute from "../msg/list";
import * as deleteRoute from "../msg/delete";
import {publicProcedure, router} from "../trpc";
import {db} from "../utils/db";
import {storageClient} from "../utils/s3";
import {getEnvVar} from "../utils/env";

const BUCKET_NAME = getEnvVar("AWS_S3_BUCKET");

export const msgRouter = router({
  add: publicProcedure
    .input(addRoute.ZInput)
    // Dependencies are injected as arguments to the handlers
    .mutation(({input}) => addRoute.handler(input, db, storageClient, BUCKET_NAME)),
  
  list: publicProcedure
    .input(listRoute.ZInput)
    .query(({input}) => listRoute.handler(input, db, BUCKET_NAME)),
  
  delete: publicProcedure
    .input(deleteRoute.ZInput)
    .mutation(({input}) => deleteRoute.handle(input, db, storageClient, BUCKET_NAME)),
});