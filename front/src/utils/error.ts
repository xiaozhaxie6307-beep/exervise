export const getErrorMessage = (e: unknown, fallback = '操作失败'): string => {
  if (e instanceof Error && e.message) return e.message;
  if (typeof e === 'string') return e;
  return fallback;
};

export const isValidationError = (e: unknown): boolean => {
  return (
    typeof e === 'object' &&
    e !== null &&
    Array.isArray((e as { errorFields?: unknown }).errorFields)
  );
};
