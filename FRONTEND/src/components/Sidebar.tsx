import type { Dispatch, SetStateAction } from "react"
import { useMediaQuery } from "./hooks/useMediaQuery"
import { CrossIcon } from "./icons/CrossIcon"
import { Logo } from "./icons/Logo"
import { TwitterICon } from "./icons/TwitterIcon"
import { YoutubeIcon } from "./icons/YoutubeIcon"
import { SidebarItem } from "./SidebarItem"

interface SidebarProps {
    sidebarOpen: boolean, 
    closeSidebar: () => void
    setFilter: Dispatch<SetStateAction<'all' | 'youtube' | 'tweet'>>
}

export const Sidebar = ({sidebarOpen, closeSidebar, setFilter}: SidebarProps) => {
    const isDesktop = useMediaQuery("(min-width:768px)")
    const sidebarWidth = isDesktop ? "w-64" : sidebarOpen ? "w-48" : "w-0"
    const zIndex = isDesktop ? "" : "z-20"

    return <div className={`h-screen transition-all duration-700 ${zIndex} overflow-hidden bg-white border-r ${sidebarWidth} fixed top-0 left-0`}>
        <div className="flex justify-between p-3">
            <div className="flex text-2xl items-center">
                <div className="pr-2 text-purple-600 cursor-pointer" onClick={() => setFilter('all')}>
                    <Logo />
                </div>
                Brainly
            </div>
            
            {!isDesktop && <div className="flex items-center">
                <div className="cursor-pointer" onClick={closeSidebar}><CrossIcon /></div>
            </div>}
        </div>
        <div className="pt-8 pl-6">
            <div onClick={() => setFilter("tweet")}>
                <SidebarItem text="Twitter" icon={<TwitterICon />} />
            </div>
            <div onClick={() => setFilter("youtube")}>
                <SidebarItem text="YouTube" icon={<YoutubeIcon />} />
            </div>
            
            
        </div>
        
    </div>
}