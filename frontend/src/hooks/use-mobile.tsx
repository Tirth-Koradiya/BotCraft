
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const SMALL_DESKTOP_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Initial check for mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Add event listener for resize
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Modern API for matchMedia
    if (mql.addEventListener) {
      mql.addEventListener("change", checkMobile)
    } else {
      // Fallback for older browsers
      window.addEventListener("resize", checkMobile)
    }
    
    // Initial check
    checkMobile()
    
    // Cleanup
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", checkMobile)
      } else {
        window.removeEventListener("resize", checkMobile)
      }
    }
  }, [])

  return isMobile !== undefined ? isMobile : false
}

export function useIsSmallDesktop() {
  const [isSmallDesktop, setIsSmallDesktop] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Initial check for small desktop
    const checkSmallDesktop = () => {
      const width = window.innerWidth
      setIsSmallDesktop(width >= MOBILE_BREAKPOINT && width < SMALL_DESKTOP_BREAKPOINT)
    }
    
    // Add event listener for resize
    const mql = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${SMALL_DESKTOP_BREAKPOINT - 1}px)`)
    
    // Modern API for matchMedia
    if (mql.addEventListener) {
      mql.addEventListener("change", checkSmallDesktop)
    } else {
      // Fallback for older browsers
      window.addEventListener("resize", checkSmallDesktop)
    }
    
    // Initial check
    checkSmallDesktop()
    
    // Cleanup
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", checkSmallDesktop)
      } else {
        window.removeEventListener("resize", checkSmallDesktop)
      }
    }
  }, [])

  return isSmallDesktop !== undefined ? isSmallDesktop : false
}
