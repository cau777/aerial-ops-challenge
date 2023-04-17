/**
 * Meant for hiding specific implementation errors from the client. Always throws an error keeping the message, but
 * removing the stacktrace
 * @param e Error
 */
export const rethrowForClient = (e: unknown): never => {
  console.error(e);
  if (e instanceof Error)
    throw new Error(e.name + ": " + e.message);
  if (typeof e === "string")
    throw new Error(e);
  throw new Error("Unknown error");
}