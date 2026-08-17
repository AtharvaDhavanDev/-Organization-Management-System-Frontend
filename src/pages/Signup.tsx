import { useState } from "react"
import { useAuthStore } from "../stores/useAuthStore";
import {EyeOff, Eye} from 'lucide-react'
import { FcGoogle } from "react-icons/fc";
import {Link} from 'react-router-dom'

function Signup(){

    const[formData , setFormData] = useState({
        name : "",
        email : "",
        password : ""
    });

    const {signup, isSignUp, googleAuth} = useAuthStore();
    const [togglePassword , setTogglePassword] = useState(false);

    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault()
        try{
            return signup(formData)
        }
        catch(error){
            console.log("Something went wrong : " , error)
        }
    }

    const handleTogglePassword = () => {
        setTogglePassword(!togglePassword)
    }

    return (
  <div
    className="
      min-h-screen
      flex
      items-center
      justify-center
      px-4
      py-8
      bg-[#11130f]
      bg-[radial-gradient(circle_at_center,_#1c2416_0%,_#11130f_65%,_#080a07_100%)]
      font-mono
      text-[#9bbc0f]
    "
  >
    {/* Terminal */}
    <div
      className="
        w-full
        max-w-2xl
        border
        border-[#6b8e23]
        bg-[#151a12]
        shadow-[0_0_60px_rgba(155,188,15,0.08)]
      "
    >

      {/* Header */}
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-[#6b8e23]
          px-6
          py-4
        "
      >
        <span className="text-lg font-bold tracking-wider">
          KAIRO v1.0
        </span>

        <span className="text-xs sm:text-sm">
          SYSTEM STATUS:{" "}
          <span className="text-[#c6e36b]">
            ONLINE ●
          </span>
        </span>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="px-6 py-8 sm:px-10"
      >

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-wider">
            <span className="mr-2">
              &gt;
            </span>
            SIGN UP
          </h1>

          <div className="mt-4 border-t border-dashed border-[#61752e]" />
        </div>

        <div className="space-y-6">

          {/* Name */}
          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-bold
                tracking-widest
              "
            >
              NAME:
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="
                w-full
                border
                border-[#61752e]
                bg-[#0c100c]
                px-4
                py-4
                text-[#c6e36b]
                outline-none
                placeholder:text-[#4d6428]
                transition
                focus:border-[#c6e36b]
                focus:shadow-[0_0_12px_rgba(198,227,107,0.12)]
              "
            />
          </div>

          {/* Email */}
          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-bold
                tracking-widest
              "
            >
              EMAIL:
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="
                w-full
                border
                border-[#61752e]
                bg-[#0c100c]
                px-4
                py-4
                text-[#c6e36b]
                outline-none
                placeholder:text-[#4d6428]
                transition
                focus:border-[#c6e36b]
                focus:shadow-[0_0_12px_rgba(198,227,107,0.12)]
              "
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-bold
                tracking-widest
              "
            >
              PASSWORD:
            </label>

            <div className="relative">

              <input
                type={togglePassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                className="
                  w-full
                  border
                  border-[#61752e]
                  bg-[#0c100c]
                  px-4
                  py-4
                  pr-14
                  text-[#c6e36b]
                  outline-none
                  placeholder:text-[#4d6428]
                  transition
                  focus:border-[#c6e36b]
                  focus:shadow-[0_0_12px_rgba(198,227,107,0.12)]
                "
              />

              <button
                type="button"
                onClick={handleTogglePassword}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-[#61752e]
                  transition
                  hover:text-[#c6e36b]
                "
              >
                {togglePassword ? (
                  <EyeOff />
                ) : (
                  <Eye />
                )}
              </button>

            </div>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="
              group
              w-full
              border
              border-[#c6e36b]
              bg-[#c6e36b]
              px-4
              py-4
              font-bold
              tracking-widest
              text-[#11130f]
              transition
              hover:bg-[#d9f27d]
              active:translate-y-[2px]
            "
          >
            <span className="mr-2">
              &gt;
            </span>

            {isSignUp
              ? "....SIGNING UP"
              : "SIGN UP"}
          </button>

          {/* OR Divider */}
          <div
            className="
              flex
              items-center
              gap-4
              py-2
              text-xs
            "
          >
            <div className="h-px flex-1 bg-[#61752e]" />

            <span className="font-bold">
              [ OR ]
            </span>

            <div className="h-px flex-1 bg-[#61752e]" />
          </div>

          {/* Google Authentication */}
          <button
            type="button"
            onClick={googleAuth}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-3
              border
              border-[#61752e]
              bg-[#0c100c]
              px-4
              py-4
              font-bold
              tracking-wider
              text-[#9bbc0f]
              transition
              hover:border-[#c6e36b]
              hover:bg-[#111811]
              hover:text-[#c6e36b]
            "
          >
            <FcGoogle size={22} />

            SIGN UP WITH GOOGLE
          </button>

        </div>
      </form>

      {/* Login Footer */}
      <div
        className="
          border-t
          border-[#6b8e23]
          px-6
          py-5
          text-center
          text-sm
        "
      >
        <span className="text-[#61752e]">
          ALREADY HAVE AN ACCOUNT?
        </span>

        {" "}

        <Link
          to="/login"
          className="
            ml-1
            font-bold
            text-[#d99a16]
            underline
            underline-offset-4
            transition
            hover:text-[#ffc928]
          "
        >
          LOGIN HERE
        </Link>
      </div>

    </div>
  </div>
);
}

export default Signup