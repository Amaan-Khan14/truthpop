import { dbConnect } from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/option";
import { UserModel } from "@/model/user";
import mongoose, { mongo } from "mongoose";

export async function DELETE(req: NextRequest, { params }: { params: { messageid: string } }) {
    const messageId = params.messageid

    await dbConnect();

    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!user || !session) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, {
            status: 401
        })
    }
    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const updateResult = await UserModel.updateOne({
            _id: userId
        }, {
            $pull: {
                messages: {
                    _id: new mongoose.Types.ObjectId(messageId)
                }
            }
        })

        if (updateResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found"
            }, {
                status: 404
            })
        }

        return Response.json({
            success: true,
            message: "Message deleted"
        }, {
            status: 200
        })
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error deleting message"
        }, {
            status: 500
        })
    }
}