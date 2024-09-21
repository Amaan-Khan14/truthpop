import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/user";
import { usernameValidation } from "@/validator/signUp";
import { NextRequest } from "next/server";
import { z } from "zod";

const usernameValidator = z.object({
    username: usernameValidation
})
export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);

        let username = searchParams.get("username");
        console.log(username);
        const queryParam = {
            username
        }

        const result = usernameValidator.safeParse(queryParam);

        if (!result.success) {

            return Response.json({
                success: false,
                message: "Invalid username",
            })
        }

        const existingUserByUsername = await UserModel.findOne({
            username: result.data.username,
            isVerified: true
        })

        if (existingUserByUsername) {
            return Response.json({
                success: false,
                message: "Username already exists",
            });
        }

        return Response.json({
            success: true,
            message: "Username is available",
        }, {
            status: 200,
        });

    } catch (err) {
        console.error(err);
        return Response.json({
            success: false,
            message: "An error occurred",
        }, {
            status: 500,
        }
        )
    }
}