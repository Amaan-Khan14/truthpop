import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";
import { UserModel } from "@/model/user";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
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

    const { isAcceptingMessages } = await req.json()
    try {
        const updatedUser = await UserModel.findByIdAndUpdate({
            _id: userId
        }, {
            isAcceptingMessages: isAcceptingMessages
        }, {
            new: true
        })

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user for message acceptance"
            }, {
                status: 400
            })
        }

        return Response.json({
            success: true,
            message: "Updated user for message acceptance"
        }, {
            status: 200
        })

    } catch (error) {
        console.error(error)
        return Response.json({
            success: false,
            message: "Error updating user for message acceptance"
        }, {
            status: 500
        })

    }
}

export async function GET() {
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

    const userId = user._id

    try {
        const userFound = await UserModel.findById(userId)

        if (!userFound) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }

        return Response.json({
            success: true,
            message: "User found",
            isAcceptingMessages: userFound.isAcceptingMessages
        }, {
            status: 200
        })
    } catch (error) {
        console.error(error)
        return Response.json({
            success: false,
            message: "Error finding user"
        }, {
            status: 500
        })
    }

}