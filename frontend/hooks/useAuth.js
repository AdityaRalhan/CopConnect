"use client";

import { useEffect, useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token");
      const role = sessionStorage.getItem("role");
      const data = sessionStorage.getItem("data");

      if (token && role) {
        setUser({
          token,
          role,
          data: JSON.parse(data),
        });
      }
    }
  }, []);

  return user;
}
