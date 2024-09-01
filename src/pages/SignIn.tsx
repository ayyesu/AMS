// SignIn.tsx
import * as React from 'react'
import { Button } from "@/components/ui/button"; // Ensure the path matches your Vite project structure
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {SignInOrbit} from "@/components/SignInOrbit";

export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your password link and a link to sign up if you do not have an account. The second column has a cover image.";

export function SignIn() {
  return (
    <div className="w-full lg:grid lg:grid-cols-2 ">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Staff ID</Label>
              <Input
                id="email"
                type="email"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">PIN</Label>
                <a
                  href="/forgot-pin"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your pin?
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
       <SignInOrbit />
      </div>
    </div>
  );
}

export default SignIn;
