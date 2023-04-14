/**
 * This is a Next.js page.
 */
import { trpc } from '../utils/trpc';
import {SendMessageForm} from "~/modules/chatroom/SendMessageForm";

export default function IndexPage() {
  return (
    <SendMessageForm></SendMessageForm>
  )
}
