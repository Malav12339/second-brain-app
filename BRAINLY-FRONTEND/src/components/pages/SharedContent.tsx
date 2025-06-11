import { useParams } from "react-router-dom"
import { useSharedContent } from "../hooks/useSharedContent"
import { useMediaQuery } from "../hooks/useMediaQuery"
import { useEffect, useState } from "react"
import { Sidebar } from "../Sidebar"
import { MenuIcon } from "../icons/MenuIcon"
import { Card } from "../Card"

const SharedContent = () => {
    const { shareId } = useParams()
    const [sidebarOpen, setSidebarOpen] = useState(true)
    type FilterType = 'all' | 'youtube' | 'tweet'
    const [filter, setFilter] = useState<FilterType>("all")
    
    // Add ContentItem interface (same as Dashboard)
    interface ContentItem {
        title: string;
        link: string;
        type: "youtube" | "tweet";
    }
    const [filteredContent, setFilteredContent] = useState<ContentItem[]>([])
    
    const isDesktop = useMediaQuery("(min-width:768px)")
    const dashboardMargin = isDesktop ? "ml-64" : "ml-0"

    if(!shareId) {
        return <div>Please provide valid link</div>
    }

    const { isError, userData } = useSharedContent(shareId)

    useEffect(() => {
        setSidebarOpen(isDesktop)
    }, [isDesktop])

    // Add filtering logic (same as Dashboard)
    useEffect(() => {
        if (!userData?.content) return; // Early return if no content
        
        if(filter === "all") {
            setFilteredContent(userData.content)
            return;
        }
        
        const filtered = userData.content.filter(({ type }) => filter === type);
        setFilteredContent(filtered);
        
    }, [filter, userData?.content])

    if(isError) {
        return <div>Please provide valid link</div>
    }
    if (!userData) {
        return <div>Loading...</div>; // While fetching
    }

    return (
        <div className=''>
            <Sidebar sidebarOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} setFilter={setFilter} />
            <div className={`transition-all duration-700 ${dashboardMargin} bg-gray-100 min-h-screen ${!isDesktop && sidebarOpen && "blur-sm pointer-events-none"}`}>
                
                {/* NAVBAR */}
                {!isDesktop && <div className='fixed cursor-pointer text-black' onClick={() => setSidebarOpen(true)}>
                    <MenuIcon />
                </div>}
               
                <br />
                <h2 className="text-xl font-semibold mb-4 text-center">
                    Shared by {userData.username}
                </h2>

                <div className='pt-16 px-3'>
                    <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}>
                        {filteredContent.map(({title, link, type}) => 
                            <Card key={`${type}-${link}`} title={title} link={link} type={type} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SharedContent