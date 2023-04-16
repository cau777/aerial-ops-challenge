import {trpc} from "../../common/hooks/trpc";
import {AnyProcedure, inferProcedureInput} from "@trpc/server";
import {AppRouter} from "../../../server/routers/_app";
import {MessageModel} from "../../../server/models/message.model";

type ContextUtils = ReturnType<typeof trpc.useContext>;
type ListProcedure = AppRouter["msg"]["list"];

/**
 * Function to isolate handling optimistic updates because some type castings are necessary. It's intended
 * to used with the spread operator to configure useMutation
 * @param contextUtils
 * @param updater
 */
export function configureOptimisticUpdates<T extends AnyProcedure>(
  contextUtils: ContextUtils, updater: (old: (MessageModel&{_id: string})[]|undefined, nValue: inferProcedureInput<T>) => inferProcedureInput<T>[]
): any {
  return {
    async onMutate(nValue: T) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await contextUtils.msg.list.cancel();
      
      // Get the data from the queryCache
      const prevData = contextUtils.msg.list.getData();
      
      // Optimistically update the data with our new post
      contextUtils.msg.list.setData(undefined!, old => updater(old as any, nValue) as any);
      
      // Return the previous data so we can revert if something goes wrong
      return {prevData};
    },
    onError(_err: unknown, newData: unknown, ctx: any) {
      // If the mutation fails, use the context-value from onMutate
      contextUtils.msg.list.setData(undefined!, ctx.prevData);
    },
    onSettled: async () => {
      // Sync with server once mutation has settled
      await contextUtils.msg.list.invalidate();
    }
  }
}