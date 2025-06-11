import axios from "axios"
import { CrossIcon } from "./icons/CrossIcon"
import { BACKEND_URL } from "../config"
import { Button } from "./Button"
import { CopyIcon } from "./icons/CopyIcon"

interface ShareProps {
    open: boolean,
    onClose: () => void,
    totalNotes: number
}

export const ShareBrainModel = ({open, onClose, totalNotes}: ShareProps) => {
    const shareInfo = "Share your entire collection of notes, documents, tweets, and videos with others. They'll be able to import your content into their own Second Brain."
    async function shareContent() {
        const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
          "share": true
        }, {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        })
        const link = response.data.link
        try {
          await navigator.clipboard.writeText(link)
          console.log("copied to clipboard")
        } catch(err) {
          console.log("failed to copy text: ", err)
        }
    }

    return <div>
        {open && <div>
            <div className="w-screen h-screen fixed top-0 left-0 bg-slate-500 opacity-70 z-40">
                {/* this will blur the background */}
            </div>
            <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-50">
                {/* for displaying content */}
                <span className="bg-white p-4 rounded max-w-md">
                    <div className="flex justify-between gap-10 pb-5">
                        <div className="font-semibold text-lg">Share Your Second Brain</div>
                        <div onClick={onClose} className="cursor-pointer">
                            <CrossIcon />
                        </div>
                    </div>
                    <div className="text-justify text-sm/5 text-gray-700 pb-4">
                        {shareInfo}
                    </div>
                    <div className="bg-red-100">
                        <Button variant="primary" text="Share Brain" startIcon={<CopyIcon />} fullWidth={true} onClick={shareContent} />
                    </div>
                    <div className="m-3 text-xs text-gray-500 flex justify-center items-center">{totalNotes} items will be shared</div>
                </span>
            </div>
        </div>}
    </div>
}