import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { to, subject, html } = await req.json();

  const { data, error } = await resend.emails.send({
    from: "Nadimu <onboarding@resend.dev>",
    to,
    subject,
    html,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json({ data });
}