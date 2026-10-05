"use client";
import Link from "next/link";
import {Button, Description, FieldError, Form, Input, Label, TextField} from "@heroui/react";
import { signIn } from "../../../lib/auth-client";

const SignInPage = () => {
  const onGoogleSignIn = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

      const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
  console.log("Form Data:", data);
 

    
    const {data: resData , error } = await signIn .social({
       
        email: data.email,
        password: data.password ,
         rememberMe: true, // If false, the user will be signed out when the browser is closed. (optional) (default: true)
    callbackURL: '/',
    })
    console.log( resData , error);
  };
    return (
      <>
        <Form className="flex w-96 flex-col gap-4" onSubmit={onSubmit}>
          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label>Email</Label>
            <Input placeholder="john@example.com" />
            <FieldError />
          </TextField>
          <TextField
            isRequired
            minLength={8}
            name="password"
            type="password"
            validate={(value) => {
              if (value.length < 8) {
                return "Password must be at least 8 characters";
              }
              if (!/[A-Z]/.test(value)) {
                return "Password must contain at least one uppercase letter";
              }
              if (!/[0-9]/.test(value)) {
                return "Password must contain at least one number";
              }
              return null;
            }}
          >
            <Label>Password</Label>
            <Input placeholder="Enter your password" />
            <Description>Must be at least 8 characters with 1 uppercase and 1 number</Description>
            <FieldError />
          </TextField>
          <div className="flex gap-2">
            <Button type="submit">
              {/*<Check /> */}
              Submit
            </Button>
            <Button type="reset" variant="secondary">
              Reset
            </Button>
          </div>
          <Button type="button" variant="secondary" onClick={onGoogleSignIn}>
            Continue with Google
          </Button>
        </Form>
        <div>
          <p>
            <small>
              Forgot Password?
              <Link className="text-blue-400 underline" href="/forgot-password">
                click here
              </Link>
            </small>
          </p>
        </div>
      </>
    );
};

export default SignInPage;