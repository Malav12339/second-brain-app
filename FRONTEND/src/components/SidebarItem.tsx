import type { ReactElement } from "react"

export const SidebarItem = ({ text, icon }: {
    text: string,
    icon: ReactElement
}) => {
    return <div className="flex py-2 text-gray-700 cursor-pointer hover:bg-gray-200 rounded 
    transition-all duration-300 max-w-48">
        <div className="pr-2 text-red-500">
            {icon}
        </div>
        <div>
            {text}
        </div>
        
    </div>
}