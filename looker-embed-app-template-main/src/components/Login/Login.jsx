import GoogleAuthButton from './GoogleAuthButton'
import Tile from 'components/Tile/Tile'
import Looker from '../../assets/looker.svg'
const Login = () => {
  return (
    <div class="size-full flex flex-col justify-center items-center">
      <div class="w-[24rem] h-[24rem]">
        <Tile styles="p-0">
          <div class="size-full flex flex-col items-center">
            {/* <h1 class="my-6 text-2xl">Looker Embed Starter Kit</h1>
            <GoogleAuthButton /> */}
            <figure class="flex justify-center items-center rounded-2xl w-full">
                <img src="https://tailwind-generator.b-cdn.net/images/card-generator/tailwind-card-generator-card-preview.png" alt="Card Preview" class="rounded-t-2xl" />
            </figure>
            <div class="flex flex-col p-4 bg-white w-full h-full rounded-b-2xl">
                <div class="text-2xl flex justify-center font-bold text-black pb-2">Looker Embed Starterkit</div>
                {/* <div class=" text-lg   text-[#374151]"></div> */}
                <div class="flex justify-center pt-6">
                  <GoogleAuthButton />
                </div>
            </div>
          </div>
        </Tile>
      </div>
    </div>
  )
}

export default Login
