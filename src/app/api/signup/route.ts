import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/user";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await req.json();

    const existingUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserByUsername) {
      return Response.json({
        status: 400,
        success: false,
        message: "Username already exists",
      });
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const existingUserByEmail = await UserModel.findOne({
      email,
    });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json({
          status: 400,
          success: false,
          message: "Email already exists",
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpires = new Date(Date.now() + 3600000);

        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const verifyCodeExpires = new Date();
      verifyCodeExpires.setHours(verifyCodeExpires.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpires,
        messages: [],
      });

      await newUser.save();
    }
    const responseEmail = await sendVerificationEmail(
      email,
      username,
      verifyCode,
    );

    if (!responseEmail.success) {
      return Response.json({
        status: 400,
        success: false,
        message: "Error sending verification email",
      });
    }

    return Response.json({
      status: 200,
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    return Response.json({
      status: 500,
      success: false,
      message: "Internal server error",
    });
  }
}
