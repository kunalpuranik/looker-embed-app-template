import routes from './routes'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Looker from '../../assets/looker.svg'

export default function Sidebar() {
  const { pathname } = useLocation()

  return (
    <>
      <div class="p-4 px-6 w-50 min-w-[150px] shrink-0">
        <h2 class="my-4 flex flex-row space-even">
          <img class="size-5 shrink-0"
            src={Looker}
            alt={"Looker Embed App Template"}
          />Looker Embed App Template</h2>
        <nav class="flex flex-col gap-2">
          {routes.map((route, i) => (
            <div class="py-1.5" key={i}>
              <div
                class={`group relative flex h-12 items-center gap-3 overflow-hidden whitespace-nowrap rounded-full p-4 text-white ${pathname === route.path ? 'bg-gray-800' : ''}`}
              >
                <img
                  class="size-5 shrink-0 "
                  src={route.img}
                  alt={route.name}
                />
                <Link to={route.path}>{route.name}</Link>
              </div>
            </div>
          ))}
        </nav>
      </div>
    </>
  )
}
