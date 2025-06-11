import { useEffect } from "react";
import { ShareIcon } from "./icons/ShareIcon";
import { DustbinIcon } from "./icons/DustbinIcon";
import { YoutubeIcon } from "./icons/YoutubeIcon";
import { TwitterBirdIcon } from "./icons/TwitterBirdIcon";
import axios from "axios";
import { BACKEND_URL } from "../config";

declare global {
  interface Window {
    twttr: {
      widgets: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
}

interface CardProps {
    title: string,
    link: string,
    type: "youtube" | "tweet",
    _id?: string, 
    onDelete?: () => void
}

export function Card({ title, link, type, _id, onDelete}: CardProps) {
    useEffect(() => {
        if (type === "tweet" && window.twttr?.widgets) {
        window.twttr.widgets.load();
        }
    }, []);


    async function deleteCard() {
        try {
            const response = await axios.delete(`${BACKEND_URL}/api/v1/content/${_id}`, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            })
            if(onDelete) onDelete()
            console.log("response after deletion -> ", response)
        } catch(e) {
            console.error("error during deletion - ", e)
        }
    }

    return <div className="">
        <div className="p-4 bg-white rounded-md border-gray-200 border min-h-48">
            <div className="flex justify-between items-start gap-2">
                {/* left side */}
                <div className="flex gap-2 flex-grow min-w-0">
                    <div className="pt-[2px] flex-shrink-0">
                        {type === "youtube" && <a>
                            <YoutubeIcon />
                        </a>}
                        {type === "tweet" && <a>
                            <TwitterBirdIcon />
                        </a>}
                    </div>
                    <div className="text-md text-gray-800 leading-snug min-w-0">
                        {title}
                    </div> 
                </div>

                {/* right side */}
                <div className="flex items-start text-gray-500 flex-shrink-0 gap-2">
                    <div className="text-gray-500">
                        <a href={link} target="_blank">
                            <ShareIcon />
                        </a>
                    </div>
                    <div className="text-gray-500">
                        <a target="_blank" onClick={deleteCard}>
                            <DustbinIcon />
                        </a>
                    </div>
                </div>
            </div>
            <div className="pt-4">
                {type === "youtube" && <iframe className="w-full" src={link.replace("watch?v=", "embed/")}
                title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>}

                {type === "tweet" && <blockquote className="twitter-tweet">
                    <a href={link.replace("x.com", "twitter.com")}></a> 
                </blockquote>}
            </div>
            
        </div>
    </div>
}