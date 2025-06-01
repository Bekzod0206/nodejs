import type { IPost } from "@/interfaces"
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card"
import { API_URL } from "@/http"
import { Button } from "../ui/button"
import { useConfirm } from "@/hooks/use-confirm"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { postSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { useMutation } from "@tanstack/react-query"
import { postStore } from "@/store/post.store"
import { toast } from "sonner"
import FillLoading from "../shared/fill-loading"
import $api from "@/http/api"

function PostCard({post}: {post: IPost}) {

  const {posts, setPosts} = postStore()
  const [open, setOpen] = useState<boolean>(false)
  const {onOpen, setPost} = useConfirm()
  const onDelete = () => {
    onOpen()
    setPost(post)
  }

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post.title,
      body: post.body
    },
  })

  const {mutate, isPending} = useMutation({
    mutationKey: ["edit-post"],
    mutationFn: async (values: z.infer<typeof postSchema>) => {
      const {data} = await $api.put(`/post/edit/${post._id}`, values)
      return data
    },
    onSuccess: (data) => {
      const newData = posts.map(c => (c._id === data._id ? data : c))
      setPosts(newData)
      setOpen(false)
    },
    onError: error => {
      // @ts-ignore
      toast(error.response.data.message)
    }
  })

  const onSubmit = (values: z.infer<typeof postSchema>) => {
    mutate(values)
  }


  return (
    <Card className="rounded-[10px]">
      <img src={`${API_URL}/${post.picture}`} alt={post.title} className="rounded-t-md h-[160px] object-cover" />
      <CardContent className="mt-2">
        <CardTitle className="line-clamp-1 text-lg">{post.title}</CardTitle>
        <p className="line-clamp-2 mt-1 text-muted-foreground text-sm">{post.body}</p>
      </CardContent>
      <CardFooter className="gap-2 grid grid-cols-2 flex-1 items-end">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button onClick={() => setOpen(true)}>Edit</Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 relative" >
            {isPending && <FillLoading />}
            <Form {...form} >
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 my-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Input title" className="bg-secondary" {...field} disabled={isPending} />
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
                        <Textarea placeholder="Input body" className="bg-secondary" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="cursor-pointer" disabled={isPending} >Submit</Button>
              </form>
            </Form>
          </PopoverContent>
        </Popover>
        <Button variant={"destructive"} onClick={onDelete}>Delete</Button>
      </CardFooter>

    </Card>
  )
}

export default PostCard