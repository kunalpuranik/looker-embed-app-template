const Tile = (props) => {
  return (
    <>
      <div class={`relative h-[90%] w-[100%] rounded-2xl shadow-sm hover:shadow-slate-800 bg-gradient-default-dark hover:shadow-md`}>
        {/* <Loader v-if="loading" /> */}

        <div class={`${props.styles ? 'flex size-full p-0' : 'flex size-full flex-col px-6 py-4'}`}>
          <div class="flex flex-row justify-between">
            <h1 class="text-[15px] font-semibold dark:text-white">
              {props.title}
            </h1>
          </div>
          <div class="h-full w-full">{props.children}</div>
        </div>
      </div>
    </>
  )
}

export default Tile
