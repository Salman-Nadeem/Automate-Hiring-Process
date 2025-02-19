"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const Confetti = dynamic(() => import("react-confetti"), { ssr: false })

export default function ConfettiAnimation() {
  const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 })

  const detectSize = () => {
    setWindowDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  useEffect(() => {
    detectSize()
    window.addEventListener("resize", detectSize)
    return () => {
      window.removeEventListener("resize", detectSize)
    }
  }, [])

  return <Confetti width={windowDimension.width} height={windowDimension.height} recycle={false} numberOfPieces={200} />
}

