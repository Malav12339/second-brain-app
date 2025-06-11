import { useRef } from "react"
import { Button } from "../Button"
import { Input } from "../Input"
import axios from "axios"
import { BACKEND_URL } from "../../config"
import { useNavigate } from "react-router-dom"

export const Signup = () => {
    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    
    async function signup() {
        const username = usernameRef.current?.value
        const password = passwordRef.current?.value
        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password
        })
        navigate("/signin")
        alert("You have signed up")
    }
    return <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
        <div className="bg-white border min-w-48 rounded-xl p-8">
            <Input reference={usernameRef} placeholder="Username" />
            <Input reference={passwordRef} placeholder="Password" type="password" />
            <p className="p-2">Have an account? <a href="/signin" className="text-violet-800">Sign in</a></p>
            <div className="pt-5">
                <Button onClick={signup} loading={false} variant="primary" text="Signup" fullWidth={true} />
            </div>
        </div>
    </div>
}