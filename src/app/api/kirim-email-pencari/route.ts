import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { pencari_id, pendonor_id, golongan, kota } = await req.json();

  const { data: { user: pencari } } = await supabaseAdmin.auth.admin.getUserById(pencari_id);
  const { data: { user: pendonor } } = await supabaseAdmin.auth.admin.getUserById(pendonor_id);
  const { data: profilPendonor } = await supabaseAdmin
    .from("profil")
    .select("nama_lengkap")
    .eq("id", pendonor_id)
    .single();

  if (!pencari?.email || !pendonor?.email) {
    return NextResponse.json({ error: "Email tidak ditemukan" }, { status: 400 });
  }

  await resend.emails.send({
    from: "Nadimu <onboarding@resend.dev>",
    to: "18224045@std.stei.itb.ac.id",
    subject: `Pendonor ${golongan} Ditemukan di ${kota}!`,
    html: `
      <p>Halo,</p>
      <p><strong>${profilPendonor?.nama_lengkap}</strong> bersedia menjadi pendonor darah <strong>${golongan}</strong> untuk permintaan kamu.</p>
      <p>Hubungi pendonor melalui email: <strong>${pendonor.email}</strong></p>
      <br/>
      <p>Terima kasih,<br/>Tim Nadimu</p>
    `,
  });

  return NextResponse.json({ ok: true });
}