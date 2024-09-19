import { dbConnect } from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";
import { UserModel } from "@/model/user";
import mongoose, { mongo } from "mongoose";

export async function GET(req: NextRequest) {
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

        const user = await UserModel.aggregate([
            {
                $match: {
                    _id: userId
                }
            }, {
                $unwind: "$messages"
            }, {
                $sort: {
                    'messages.createdAt': -1
                }
            }, {
                $group: {
                    _id: "$_id",
                    messages: {
                        $push: "$messages"
                    }
                }
            }
        ])

        if (!user || user.length === 0) {
            return Response.json({
                success: true,
                message: "No messages found"
            }, {
                status: 200
            })
        }

        return Response.json({
            success: true,
            message: "Messages found",
            messages: user[0].messages
        }, {
            status: 200
        })

    } catch (error) {
        console.error(error)
        return Response.json({
            success: false,
            message: "Error fetching messages"
        }, {
            status: 500
        })
    }
}