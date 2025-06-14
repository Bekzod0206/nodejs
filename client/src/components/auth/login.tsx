import { authSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useMutation } from "@tanstack/react-query"
import $axios from "@/http"
import { toast } from "sonner"
import FillLoading from "../shared/fill-loading"
import { authStore } from "@/store/auth.store"
import { useNavigate } from "react-router-dom"

function Login() {

  const {setAuth} = useAuth()
  const {setIsAuth, setUser} = authStore()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  const {mutate, isPending} = useMutation({
    mutationKey: ["edit-post"],
    mutationFn: async (values: z.infer<typeof authSchema>) => {
      const {data} = await $axios.post(`auth/login`, values)
      return data
    },
    onSuccess: (data) => {
      setUser(data.user)
      setIsAuth(true)
      localStorage.setItem("accessToken", data.accessToken)
      navigate("/")
    },
    onError: (error) => {
      // @ts-ignore
      toast(error?.response?.data?.message)
    }
  })

  const onSubmit = (values: z.infer<typeof authSchema>) => {
    mutate(values)
  }

  return (
    <>
      {isPending && <FillLoading />}

      <h1 className="text-2xl font-bold">Login</h1>
      <p className="text-sm text-muted-foreground">
        Don't have an account <span className="cursor-pointer text-blue-500 hover:underline" onClick={() => setAuth("register")}>Sign up</span>
      </p>

      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 my-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Input email" className="bg-gray-600 rounded-[5px]" {...field}  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Input password" type="password" className="bg-gray-600 rounded-[5px]" {...field}  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <span
              className="text-sm text-blue-500 hover:underline cursor-pointer"
              onClick={() => setAuth("forgot-password")}
            >
              Forget password?
            </span>
          </div>
          
          <Button type="submit" className="cursor-pointer">Submit</Button>
        </form>
      </Form>

    </>
  )
}

export default Login