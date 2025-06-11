import { useEffect, useState } from 'react'
import { Button } from '../Button'
import { Card } from '../Card'
import { CreateContentModel } from '../CreateContentModel'
import { PlusIcon } from '../icons/PlusIcon'
import { ShareIcon } from '../icons/ShareIcon'
import { Sidebar } from '../Sidebar'
import { useContent } from '../hooks/useContent'
import { ShareBrainModel } from '../ShareBrainModel'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { MenuIcon } from '../icons/MenuIcon'

function Dashboard() {
  const [contentModel, setContentModel] = useState(false)
  const [shareModel, setShareModel] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const {content, errorType, loading, refresh} = useContent()
  type FilterType = 'all' | 'youtube' | 'tweet'
  const [filter, setFilter] = useState<FilterType>("all")
  interface ContentItem {
    title: string;
    link: string;
    type: "youtube" | "tweet";
    _id: string
  }
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([])

  const isDesktop = useMediaQuery("(min-width:768px)")
  const dashboardMargin = isDesktop ? "ml-64" : "ml-0"


  useEffect(() => {
    if(!contentModel && !loading) refresh()
  }, [contentModel])

  useEffect(() => {
    setSidebarOpen(isDesktop)
  }, [isDesktop])

  useEffect(() => {
    if(filter == "all") {
      setFilteredContent(content)
      return;
    }
    
    const newFilter: ContentItem[] = []

    content.map(({ title, link, type, _id}) => {
      if(filter === type) {
        newFilter.push({
          title,
          link,
          type,
          _id
        })
      }
    })
    setFilteredContent(newFilter)

  }, [filter, content])

  if(errorType === 'auth') {
    return <div>
      Please Login to save and access your content
      <div>go to <a href="/signin" className='underline hover:text-blue-600'>SIGNIN PAGE</a></div>
    </div>
  }
  
  return (
    
    <div className=''>
      <Sidebar sidebarOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} setFilter={setFilter} />
      <div className={`transition-all duration-700 ${dashboardMargin} bg-gray-100 min-h-screen ${!isDesktop && sidebarOpen && "blur-sm pointer-events-none"}`}>
        <CreateContentModel open={contentModel} onClose={() => setContentModel(false)} />
        <ShareBrainModel totalNotes={content.length} open={shareModel} onClose={() => setShareModel(false)} />

        <div className={`fixed top-0 bg-slate-800 p-2 z-10 ${isDesktop ? "left-64" : "left-0"} right-0`}>
          {/* NAVBAR */}
          <div className='flex justify-between items-center'>
            {!isDesktop && <div className='cursor-pointer text-white' onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </div>}
            
            <div className={`flex gap-2 sm:gap-4 ${isDesktop ? "ml-auto" : ""}`}>
              <Button onClick={() => setContentModel(true)} variant='primary' text="Add content" startIcon={<PlusIcon />} /> 
              <Button onClick={() => setShareModel(true)} variant='secondary' text="Share Brain" startIcon={<ShareIcon />} /> 
            </div>
          </div>
        </div>

        <br />
        {/* <div className={`flex gap-2 ${isDesktop ? "flex-wrap" : "flex-col"} mt-10`}>

          {content.map(({title, link, type}, index) => <Card key={index} title={title} link={link} type={type} />)}
          
        </div> */}
        {/* <div className='pt-16 px-3 sm:px-4 lg:px-6'> */}
        <div className='pt-16 px-3'>
          <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}>
             {filteredContent.map(({title, link, type, _id}) => <Card key={`${_id}`} _id={_id} onDelete={refresh} title={title} link={link} type={type} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
