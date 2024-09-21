import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/user";
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();

                const user = await UserModel.findOne({
                    $or: [
                        { email: credentials.identifier },
                        { username: credentials.identifier }
                    ]
                })

                if (!user) {
                    throw new Error('No user found')
                }
                if (!user.isVerified) {
                    throw new Error('User is not verified')
                }
                const isValid = await bcrypt.compare(credentials.password, user.password)

                if (isValid) {
                    return user
                } else {
                    throw new Error('Invalid password')
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }
            return token
        },
        async session({ session, token }: { session: any, token: any }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session
        }
    },
    pages: {
        signIn: '/auth/signin',
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.SECRET,
}

export default NextAuth(authOptions)