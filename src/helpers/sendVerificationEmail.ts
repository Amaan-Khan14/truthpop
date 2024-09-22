import { resend } from "@/lib/resend";
import VerifyEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: process.env.EMAIL as string,
      to: email,
      subject: "Truth Pop Verification Email",
      react: VerifyEmail({ username, otp: verifyCode }),
    })
    return {
      success: true,
      message: "Verification email sent",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: " Error sending verification email",
    };
  }
}
