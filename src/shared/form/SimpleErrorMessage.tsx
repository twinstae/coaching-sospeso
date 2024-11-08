export function SimpleErrorMessage({
  error,
  id,
}: {
  id: string;
  error: undefined | { message?: string };
}) {
  if (!error?.message) {
    return null;
  }

  return (
    <p id={id} role="alert" aria-label={error.message} className="text-error">
      {error.message}
    </p>
  );
}
