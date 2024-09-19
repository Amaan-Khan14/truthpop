import { dbConnect } from "@/lib/dbConnect";
import { Message, UserModel } from "@/model/user";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect();

    const { username, message } = await req.json();
    try {
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }

        const messageObj = { content: message, createdAt: new Date() }
        user.messages.push(messageObj as Message)
        await user.save()

        return Response.json({
            success: true,
            message: "Message sent successfully"
        }, {
            status: 200
        })

    } catch (error) {
        console.error(error)
        return Response.json({
            success: false,
            message: "Error sending message"
        }, {
            status: 500
        })
    }
}