// SignIn.tsx
import * as React from 'react'
import { Button } from "@/components/ui/button"; // Ensure the path matches your Vite project structure
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {SignInOrbit} from "@/components/SignInOrbit";
import SigninbgImage from "/src/assets/images/Signinbg.jpg"

export function SignIn() {
  return (
    <div className="w-full lg:grid lg:grid-cols-2 bg-image bg-cover bg-center" style={{
      backgroundImage: `url(${SigninbgImage})`,
    }}>
      <div className="flex items-center justify-center py-12 h-screen">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Staff ID</Label>
              <Input
                id="email"
                type="staffId"
                placeholder="Enter your staff ID"
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
            <Button type="submit" className="relative z-10 px-[25px] py-[15px] rounded-[15px] bg-[#e8e8e8] text-[#212121] font-extrabold text-[17px] shadow-lg hover:text-[#e8e8e8] transition-all duration-250 before:absolute before:top-0 before:left-0 before:h-full before:w-0 before:rounded-[15px] before:bg-[#212121] before:z-[-1] before:shadow-lg before:transition-all before:duration-250 hover:before:w-full overflow-hidden">
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
