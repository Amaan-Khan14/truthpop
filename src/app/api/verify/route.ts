import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/user";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect()

    try {
        const { username, verifyCode } = await req.json()
        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({
            username: decodedUsername
        })

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }

        const isCodeExpired = new Date(user.verifyCodeExpires) > new Date()
        const isCodeMatched = user.verifyCode === verifyCode

        if (isCodeExpired && isCodeMatched) {
            user.isVerified = true
            await user.save()
            return Response.json({
                success: true,
                message: "User verified"
            }, {
                status: 200
            })
        } else if (!isCodeExpired) {
            return Response.json({
                success: false,
                message: "Verification code expired, please sign up again"
            }, {
                status: 400
            })
        } else {
            return Response.json({
                success: false,
                message: "Invalid verification code"
            }, {
                status: 400
            })
        }
    } catch (err) {
        console.error(err)
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, {
            status: 500
        })
    }
}