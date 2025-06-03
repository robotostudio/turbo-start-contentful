export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export async function safeAsync<T>(promise: Promise<T>): Promise<Result<T>> {
  try {
    const data = await promise;
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}
