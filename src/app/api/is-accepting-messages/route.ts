import { NextRequest } from 'next/server';
import { getServerSession } from "next-auth/next";

import mongoose from 'mongoose';
import { authOptions } from '../auth/[...nextauth]/option';
import { dbConnect } from '@/lib/dbConnect';
import { UserModel } from '@/model/user';

export async function GET(req: NextRequest) {
    await dbConnect();

    const url = new URL(req.url);
    const username = url.searchParams.get('username');

    if (!username) {
        return Response.json({
            success: false,
            message: "Username is required"
        }, {
            status: 400
        })
    }

    try {
        const userFound = await UserModel.findOne({
            username: username
        })

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