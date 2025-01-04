import React from "react";

const ErrorPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const message = (await searchParams).message;
  return <div>Error: {message}</div>;
};

export default ErrorPage;
