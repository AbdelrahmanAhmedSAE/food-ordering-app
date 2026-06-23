"use client";
interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  return (
    <main>
      <h1>Unexpected Error!!!</h1>
      <p>{error.message}</p>
      <button onClick={reset}>retry</button>
    </main>
  );
};

export default ErrorPage;
