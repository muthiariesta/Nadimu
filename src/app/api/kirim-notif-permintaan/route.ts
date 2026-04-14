import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.json();
  const { golongan, kota, nama_pasien, rs, pendonor_ids } = body;

  console.log("=== kirim-notif-permintaan ===");
  console.log("golongan:", golongan);
  console.log("kota:", kota);
  console.log("pendonor_ids:", pendonor_ids);

  if (!pendonor_ids || pendonor_ids.length === 0) {
    console.log("Tidak ada pendonor yang cocok ditemukan.");
    return NextResponse.json({ ok: true, info: "no pendonor" });
  }

  for (const id of pendonor_ids) {
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(id);
    
    console.log("Kirim ke pendonor id:", id, "email:", user?.email, "error:", userError);
    
    if (!user?.email) continue;

    const { error: emailError } = await resend.emails.send({
      from: "Nadimu <onboarding@resend.dev>",
      to: "18224045@std.stei.itb.ac.id",
      subject: `Ada yang Butuh Darah ${golongan} di ${kota}`,
      html: `
        <p>Halo,</p>
        <p>Ada permintaan darah golongan <strong>${golongan}</strong> untuk pasien <strong>${nama_pasien}</strong> di <strong>${rs}, ${kota}</strong>.</p>
        <p>Buka Nadimu dan konfirmasi di halaman Permintaan Aktif jika kamu bersedia membantu.</p>
        <br/>
        <p>Terima kasih,<br/>Tim Nadimu</p>
      `,
    });

    console.log("Email error:", emailError);
  }

  return NextResponse.json({ ok: true });
}