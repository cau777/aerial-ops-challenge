/**
 * Get an environmental variable or throw an error
 * @param name
 */
export const getEnvVar = (name: string) => {
  const value = process.env[name];
  if (value === undefined)
    throw new Error(`Please define ${name} in the environmental variables`);
  return value;
}