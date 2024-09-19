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

        const queryParam = {
            username: searchParams.get("username")
        }

        const result = usernameValidator.safeParse(queryParam);

        if (!result.success) {

            const error = result.error.format().username?._errors || [];

            return Response.json({
                success: false,
                message: error.length ? error.join(', ') : "Invalid username",
            }, {
                status: 400
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
            }, {
                status: 400,
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