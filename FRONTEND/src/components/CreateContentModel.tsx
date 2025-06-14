import { useRef, useState } from "react"
import { Button } from "./Button"
import { CrossIcon } from "./icons/CrossIcon"
import { Input } from "./Input"
import axios from "axios"
import { BACKEND_URL } from "../config"

enum ContentType {
    Youtube = "youtube",
    Twitter = "tweet"
}

export const CreateContentModel = ({ open, onClose }: {open: boolean, onClose: () => void}) => {
    const titleRef = useRef<HTMLInputElement>(null)
    const linkRef = useRef<HTMLInputElement>(null)
    const [type, setType] = useState(ContentType.Youtube)
    

    async function addContent() {
        const title = titleRef.current?.value 
        const link = linkRef.current?.value 
       
        await axios.post(`${BACKEND_URL}/api/v1/content`, {
            title,
            type,
            link
        }, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
        onClose()
    }
    return <div>
        {open && <div> 
            <div className="w-screen h-screen fixed top-0 left-0 bg-slate-500 opacity-70
            flex justify-center">
            </div>
            <div className="w-screen h-screen fixed top-0 left-0 flex justify-center">
                <div className="flex flex-col justify-center">
                    <span className="bg-white opacity-100 p-4 rounded">
                        <div className="flex justify-end">
                            <div onClick={onClose} className="cursor-pointer">
                                <CrossIcon />
                            </div>
                            
                        </div>
                        <div>
                            <Input reference={titleRef} placeholder="Title" onChange={() => null} />
                            <Input reference={linkRef} placeholder="Link" onChange={() => null} />
                        </div>
                        <div>
                            <h1>Type</h1>
                            <div className="flex gap-2 p-4">
                                <Button text="Youtube" variant={type === ContentType.Youtube ? "primary" : "secondary"} 
                                onClick={() => setType(ContentType.Youtube)} />
                                <Button text="Twitter" variant={type === ContentType.Twitter ? "primary" : "secondary"} 
                                onClick={() => setType(ContentType.Twitter)} />
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <Button onClick={addContent} variant="primary" text="submit" />
                        </div>
                    </span>
                </div>
            </div>

        </div>}
    </div>
}