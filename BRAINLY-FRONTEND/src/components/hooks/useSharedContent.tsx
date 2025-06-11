import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../config";

interface ContentItem {
    title: string;
    link: string;
    type: "youtube" | "tweet";
}

interface UserInfo {
    username: string;
    content: ContentItem[];
}

export function useSharedContent(shareLink: string): {
    userData: UserInfo | null,
    isError: boolean
} {
    const [userData, setUserData] = useState<UserInfo | null>(null)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        if(!shareLink) return;
        axios.get<UserInfo>(`${BACKEND_URL}/api/v1/brain/${shareLink}`)
            .then((res) => {
                setUserData(res.data)
                setIsError(false)
            })
            .catch(() => {
                setIsError(true)
            })
    }, [shareLink])
    
    return {
        userData,
        isError
    }
}