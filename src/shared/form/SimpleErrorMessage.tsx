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
    <p id={id} role="alert" className="text-error">
      {error.message}
    </p>
  );
}
