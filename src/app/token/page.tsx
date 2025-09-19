"use client";

import { useAuth } from "@clerk/nextjs";

export default function GetToken() {
  const { getToken } = useAuth();

  async function fetchData() {
    const token = await getToken({ template: "JWT_template" });
    console.log(token);
  }

  return <button onClick={fetchData}>Fetch</button>;
}
