import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import CreatePost from "../create-post"
import { useCreatePost } from "@/hooks/use-create-post"
import { authStore } from "@/store/auth.store"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

function Navbar() {

  const {isAuth, user} = authStore()
  const { onOpen } = useCreatePost()

  return (
    <>
      <div className="w-full h-24 bg-gray-900 fixed inset-0">
        <div className="max-w-[1440px] mx-auto h-full flex justify-between items-center">
          <Link to={"/"} className="flex items-center justify-center gap-2 ml-2" >
            <img src={"/vite.svg"} alt="site-logo" />
            <p className="font-bold text-4xl">Blog site</p>
          </Link>

          <div className="flex items-center gap-2">
            <Button className="rounded-full font-bold cursor-pointer" size={"lg"} variant={"outline"} onClick={onOpen}>
              Create Post
            </Button>
            {isAuth ? 
            (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel className="line-clamp-2">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            ) : (
              <Link to={"/auth"}>
                <Button className="rounded-full font-bold cursor-pointer" size={"lg"}>
                  Auth
                </Button>
              </Link>
            )}
          </div>

        </div>
      </div>

      <CreatePost />
    </>
  )
}

export default Navbar