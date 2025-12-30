import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { AuthContext } from "./AuthContext";

/* ================= UTIL ================= */
function generateSlug(name) {
  return (
    name
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") || "barbearia"
  );
}

/* ============== PROVIDER ================ */
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------- LOAD PROFILE ---------- */
  async function loadProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Erro ao buscar profile:", error.message);
      return null;
    }

    return data;
  }

  /* ---------- ENSURE BARBER SHOP ---------- */
  async function ensureBarberShop(profileData) {
    if (!profileData) return profileData;

    // Só barbeiro
    if (profileData.role !== "barber") return profileData;

    // Já tem barbearia
    if (profileData.barber_shop_id) return profileData;

    const slug = generateSlug(profileData.name);

    // Criar barber_shop
    const { data: shop, error: shopError } = await supabase
      .from("barber_shops")
      .insert({
        name: profileData.name,
        slug,
        owner_id: profileData.id,
      })
      .select()
      .single();

    if (shopError) {
      console.error("Erro ao criar barber_shop:", shopError.message);
      return profileData;
    }

    // Atualizar profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ barber_shop_id: shop.id })
      .eq("id", profileData.id);

    if (updateError) {
      console.error("Erro ao atualizar profile:", updateError.message);
      return profileData;
    }

    // Retornar profile atualizado
    return { ...profileData, barber_shop_id: shop.id };
  }

  /* ---------- AUTH LIFECYCLE ---------- */
  useEffect(() => {
    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);

        let profileData = await loadProfile(session.user.id);
        profileData = await ensureBarberShop(profileData);

        setProfile(profileData);
      }

      setLoading(false);
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);

        let profileData = await loadProfile(session.user.id);
        profileData = await ensureBarberShop(profileData);

        setProfile(profileData);
      }

      if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ---------- SIGN IN ---------- */
  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return data;
  }

  /* ---------- SIGN OUT ---------- */
  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
