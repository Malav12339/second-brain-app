import axios from "axios"
import { Button } from "../Button"
import { Input } from "../Input"
import { BACKEND_URL } from "../../config"
import { useRef } from "react"
import { useNavigate } from "react-router-dom"

export const Signin = () => {
    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    async function signin() {
        const username = usernameRef.current?.value
        const password = passwordRef.current?.value
        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        })
        localStorage.setItem("token", response.data.token)
        navigate("/dashboard")
    }
    return <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
        <div className="bg-white border min-w-48 rounded-xl p-8">
            <Input reference={usernameRef} placeholder="Username" />
            <Input reference={passwordRef} placeholder="Password" type="password" />
            <p className="p-2">Don't Have an account? <a href="/signup" className="text-violet-800">Sign up</a></p>
            <div className="pt-5">
                <Button onClick={signin} loading={false} variant="primary" text="Signin" fullWidth={true} />
            </div>
        </div>
    </div>
}