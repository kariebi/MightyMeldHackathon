import React, { useState } from 'react'
import { IoSettings } from "react-icons/io5";
import { FaVolumeHigh, FaVolumeXmark } from "react-icons/fa6";
import { useGame } from "./context/GameContext";

const Settings = () => {
    const { SFXMute, setSFXMute, bgMute, setbgMute } = useGame()
    const [showSettings, setshowSettings] = useState(false)
    const speakerclass = "rounded-full w-[20px] h-[20px] p-[3px]"
    return (
        <div className='fixed bottom-[64px] right-3'>
            <div onClick={() => { setshowSettings(!showSettings) }} className={`fixed bottom-2 right-2 transition duration-500 shadow-md ${showSettings ? "bg-blue-500" : "bg-blue-200"} rounded-full p-2 z-10`}>
                <IoSettings className={`transition text-[30px] duration-200 ${showSettings ? "rotate-180 text-blue-200" : "text-blue-600 rotate-0"}`} />
            </div>
            <div className={`text-blue-600 bg-white/60 pl-1 py-0.5 w-[82px] backdrop-blur-md rounded-md flex flex-col transition-all duration-500 gap-1 ${showSettings ? "scale-100 opacity-100 translate-y-0" : " translate-y-20 translate-x-10 opacity-0 scale-0"}`}>
                <div className={`transition duration-500 flex justify-between items-center gap-1 pr-2 ${showSettings ? "translate-y-0 scale-100" : "translate-y-10 scale-0"}`}>
                    <span className=''>Music</span>
                    <div onClick={() => { setbgMute(!bgMute) }} className=''>
                        {
                            bgMute ?
                                <FaVolumeXmark className={`${speakerclass} bg-blue-600 text-blue-200`} />
                                :
                                <FaVolumeHigh className={`${speakerclass} bg-blue-200`} />
                        }
                    </div>
                </div>
                <div className={`flex items-center gap-1 pr-2 transition duration-300 justify-between ${showSettings ? "translate-y-0 scale-100" : "translate-y-10 scale-0"}`}>
                    <span className=''>SFX</span>
                    <div onClick={() => { setSFXMute(!SFXMute) }} className=''>
                        {
                            SFXMute ?
                                <FaVolumeXmark className={`${speakerclass} bg-blue-600 text-blue-200`} />
                                :
                                <FaVolumeHigh className={`${speakerclass} bg-blue-200 `} />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings