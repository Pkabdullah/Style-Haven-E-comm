import dbconnect from "@/utils/dbconnnect";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { UserSignup } from "@/utils/models";

export const auth = {
  session: {
    strategy: "jwt", // Use JWTs for session strategy
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await dbconnect();
          const user = await UserSignup.findOne({ Email: email });
          if (!user) {
            throw new Error("No user registered");
          }
          const passwordMatch = await bcrypt.compare(password, user.Password);
          if (!passwordMatch) {
            throw new Error("Invalid password");
          }
          // Return user information that you want to include in the session
          return {
            id: user._id.toString(), // Ensure _id is a string
            name: user.FullName,
            email: user.Email,
          
          };
             console.log("usersss",user)
         
        } catch (error) {
          console.log(error);
          throw new Error("Authentication failed"); // Make sure to throw an error to handle it
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Merge the returned user object with the token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach token data to the session object
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn:`/login`,
  },
};

const handler = NextAuth(auth);
export { handler as GET, handler as POST };


// import dbconnect from "@/utils/dbconnnect";
// import NextAuth from "next-auth/next";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// import { UserSignup } from "@/utils/models";

// import { getToken } from "next-auth/jwt";

// export const auth = {
//   session: {
//     strategy: "jwt",
//   },
//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {},

//       async authorize(credentials) {
//         const { Email, Password } = credentials;

//         try {
//           await dbconnect();
//           const user = await UserSignup.findOne({ Email });
//           if (!user) {
//             throw new Error("No user registered");
//           }
//           const passwordMatch = await bcrypt.compare(Password, user.Password);
//           if (!passwordMatch) {
//             throw new Error("Invalid password");
//           }
//           console.log("user", user._id);
//           // if i want to user data in my session so i want to return specific field that i want in my session data
//           return {
//             name: user.FullName,
//             email: user.Email,
           
//           };
//         } catch (error) {
//           console.log(error);
//         }
//       },
//     }),
//   ],
//   async jwt({ token, user }) {
//     return { ...token, ...user };
//   },
//   async session({ session, token, user }) {
//     session.user = token 
//     return session;
//   },

//   secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: "/login",
//   },
// };

// const handler = NextAuth(auth);
// export { handler as GET, handler as POST };

// const secret = process.env.NEXTAUTH_SECRET;
