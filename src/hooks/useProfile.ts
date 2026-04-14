import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface Profile {
  id: string;
  nama_lengkap: string;
  golongan_darah: string;
  rhesus: string;
  provinsi: string;
  kota: string;
  total_poin: number;
  total_donor: number;
  foto_url: string | null;
  tanggal_lahir: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }

      const { data } = await supabase
        .from("profil")
        .select("id, nama_lengkap, golongan_darah, rhesus, provinsi, kota, total_poin, total_donor, foto_url, tanggal_lahir")
        .eq("id", session.user.id)
        .single();

      if (data) setProfile(data);
      setLoading(false);
    };

    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });

    return () => subscription.unsubscribe();
  }, []);

  return { profile, loading };
}