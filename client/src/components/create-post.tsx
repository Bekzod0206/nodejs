import { useCreatePost } from "@/hooks/use-create-post"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { postSchema } from "@/lib/validation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { useState, type ChangeEvent } from "react"
import { toast } from "sonner"
import { postStore } from "@/store/post.store"
import $api from "@/http/api"

function CreatePost() {

  const {posts, setPosts} = postStore()
  const [loading, setLoading] = useState(false)
  const [picture, setPicture] = useState<File | null>(null)
  const { isOpen, onClose } = useCreatePost()
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      body: ""
    },
  })

  const onSubmit = async (values: z.infer<typeof postSchema>) => {
    if(!picture) return null
    setLoading(true)
    const formData = new FormData()
    formData.append("title", values.title)
    formData.append("body", values.body)
    formData.append("picture", picture)
    
    try {
      const {data} = await $api.post('/post/create', formData)
      const newData = [...posts, data]
      setPosts(newData)
      form.reset()
      onClose()
    } catch (error) {
      console.log(error)
      // @ts-ignore
      toast(error?.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    setPicture(file as File)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create a post</SheetTitle>
          <SheetDescription>
            Create your post
          </SheetDescription>
        
          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 my-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Input title" className="bg-secondary" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Input body" className="bg-secondary" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Label htmlFor="picture">Upload File</Label>
                <Input id="picture" type="file" className="bg-secondary mt-2" onChange={onFileChange} disabled={loading} />
              </div>
              <Button type="submit" className="cursor-pointer" disabled={loading}>Submit</Button>
            </form>
          </Form>
        
        </SheetHeader>


      </SheetContent>
    </Sheet>
  )
}

export default CreatePost