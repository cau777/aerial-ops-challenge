import {trpc} from "../../common/hooks/trpc";
import {inferProcedureInput,} from "@trpc/server";
import {ZMessageModel} from "../../../server/models/message.model";
import {AppRouter} from "../../../server/routers/_app";
import {InfiniteData} from "@tanstack/react-query";

type ContextUtils = ReturnType<typeof trpc.useContext>;
type DataArray = (ZMessageModel & { _id: string })[];
type Msg = typeof trpc.msg;
type ConfigObject<TName extends "add"|"delete"> = Parameters<Msg[TName]["useMutation"]>[0]
/**
 * Function to isolate handling optimistic updates. It's intended to be used with the spread operator to configure useMutation
 * @param client
 * @param input
 * @param updater
 * @param onError
 */
export function configureOptimisticUpdatesForMsg<
  TName extends "add" | "delete",
>(
  client: ContextUtils, input: inferProcedureInput<AppRouter["msg"]["list"]>,
  updater: (old: InfiniteData<DataArray> | undefined, nValue: inferProcedureInput<AppRouter["msg"][TName]>) => InfiniteData<DataArray>,
  onError?: (error: string) => void,
): ConfigObject<TName> {
  return {
    async onMutate(nValue: inferProcedureInput<AppRouter["msg"][TName]>) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await client.msg.list.cancel();
      
      // Get the data from the queryCache
      const prevData = client.msg.list.getInfiniteData(input);
      
      // Optimistically update the data with our new post
      client.msg.list.setInfiniteData(input, old => updater(old, nValue));
      
      // Return the previous data, so we can revert if something goes wrong
      return {prevData};
    },
    onError(err: unknown, _newData: unknown, ctx: any) {
      // If the mutation fails, use the context-value from onMutate
      client.msg.list.setInfiniteData(input, ctx.prevData);
      if (err instanceof Error && onError !== undefined)
        onError(err.message);
    },
    onSettled: async () => {
      // Sync with server once mutation has settled
      await client.msg.list.invalidate(input);
    }
  }
}