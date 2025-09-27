// hooks/useAuth.ts
import { useState, useEffect } from "react";
import { jwtVerify, type JWTPayload } from "jose";
import { cookies } from 'next/headers'; // Import cookies from next/headers (SERVER COMPONENT)

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function validateToken() {
      // This will only work if your dashboard is a server component
      const token = cookies().get('token')?.value; // Get cookie in server component

      if (token) {
        try {
          const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
          const decodedUser = payload as JWTPayload & User; // Assuming your payload contains user info
          setUser(decodedUser);
        } catch (error) {
          console.error("JWT Verification Error:", error);
          setUser(null); // Clear user if token is invalid
        } finally {
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setIsLoading(false);
      }
    }

    validateToken();
  }, []);

  return { user, isLoading };
}

export default useAuth;