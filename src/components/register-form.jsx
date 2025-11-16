'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import React from "react"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import axios from "axios"


export function RegisterForm({
  className,
  ...props
}) {

  const [formData, setFormData] = React.useState({
    email: '',
      password: '',
      firstName: '',
        lastName: ''
  });
  const [loading, setLoading] = React.useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
  }

  const router = useRouter()

  const handleRegister = async (e) => {
      e.preventDefault();

      setLoading(true);
      
      try {

          // register with only email/password/username
          const resgisterRes = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local/register`, {
              username: formData.email,
              email: formData.email,
                password: formData.password,
          });

          const jwtToken = resgisterRes.data.jwt;
          const userId = resgisterRes.data.user.id;

          // update user with firstName and lastName
          await axios.put(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${userId}`, {
              firstName: formData.firstName,
              lastName: formData.lastName,
          }, {
              headers: {
                  Authorization: `Bearer ${jwtToken}`,
              },
          });

          // Sign in the user after successful registration
          const res = await signIn("credentials", {
            redirect: false,
            email: formData.email,
            password: formData.password,
          });

          if (!res?.error) {
              router.push("/dashboard");
          } else {
                toast.error("Registration succeeded but login failed, try logging in manually.");
          }
          
          
        
      } catch (error) {
        toast.error(error.response?.data?.error?.message || "Registration failed");
        
      }
      finally {
          setLoading(false);
          
      }
    
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Register</CardTitle>
          <CardDescription>
            Please enter your details to Register.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="firstName">FirstName</FieldLabel>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  required
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  required
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <div className="flex items-center"></div>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href="/login">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
