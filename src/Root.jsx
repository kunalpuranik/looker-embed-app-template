import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar/Sidebar'
import Header from './components/Header/Header'

export default function Root() {
  return (
    <>
      <div class="flex flex-row size-full overscroll-none font-medium text-white bg-[#121212]">
        <Sidebar />
        <div class="flex w-full flex-col">
          <Header />
          <Outlet />
        </div>
      </div>
    </>
  )
}
