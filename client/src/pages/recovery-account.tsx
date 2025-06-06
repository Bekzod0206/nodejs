import FillLoading from "@/components/shared/fill-loading"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import $axios from "@/http"
import { passwordSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import type { z } from "zod"

function RecoveryAccount() {
  const {token} = useParams()
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    },
  })

  const {mutate, isPending} = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: async (values: z.infer<typeof passwordSchema>) => {
      const obj = {password: values.password, token}
      console.log(obj, "obj")
      const {data} = await $axios.put(`/auth/recovery-account`, obj)
      return data
    },
    onSuccess: () => {
      toast("Successfully recovered an account, log in")
      navigate("/auth")
    },
    onError: (error) => {
      // @ts-ignore
      toast(error?.response?.data?.message)
    }
  })

  const onSubmit = (values: z.infer<typeof passwordSchema>) => {
    mutate(values)
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      {isPending && <FillLoading />}
      <Card className="w-1/3 bg-secondary p-3 rounded-[10px] relative">
        <CardContent>
          <h1 className="text-2xl font-bold">Account recovery</h1>

          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 my-8">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Input password" className="bg-gray-600 rounded-[5px]" {...field}  />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm new password</FormLabel>
                    <FormControl>
                      <Input placeholder="Confirm password" type="password" className="bg-gray-600 rounded-[5px]" {...field}  />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="cursor-pointer">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default RecoveryAccount