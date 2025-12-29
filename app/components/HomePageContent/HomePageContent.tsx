"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function HomePageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);
      return;
    }

    setUserId(data.user.id);
  };

  const loadFavorites = async () => {
    const { data, error } = await supabase
      .from("favorite_characters")
      .select("*");

    console.log("favorites:", data);
    console.log("error:", error);
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Login</h1>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={signIn}>Sign in</button>

      {userId && (
        <>
          <p>Logged in as: {userId}</p>
          <button onClick={loadFavorites}>Load favorites</button>
        </>
      )}
    </div>
  );
}
