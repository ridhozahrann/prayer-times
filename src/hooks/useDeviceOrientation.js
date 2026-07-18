import { useState, useEffect } from 'react'

export const useDeviceOrientation = () => {
    const [heading, setHeading] = useState(0)
    const [accuracy, setAccuracy] = useState(null)
    const [isSupported, setIsSupported] = useState(true)
    const [permissionGranted, setPermissionGranted] = useState(null)
    const [isiOS, setIsiOS] = useState(false)

    useEffect(() => {
        // Detect if iOS (requires requestPermission)
        const iOS =
            typeof window !== 'undefined' &&
            typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function'
        setIsiOS(iOS)

        if (iOS) {
            setPermissionGranted(false) // Needs user gesture initialization
        } else {
            // Check if API events are supported on others
            if (!('ondeviceorientation' in window) && !('ondeviceorientationabsolute' in window)) {
                setIsSupported(false)
            } else {
                setPermissionGranted(true)
            }
        }
    }, [])

    const requestPermission = async () => {
        if (
            typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function'
        ) {
            try {
                const permissionState = await DeviceOrientationEvent.requestPermission()
                if (permissionState === 'granted') {
                    setPermissionGranted(true)
                    setIsSupported(true)
                    return true
                } else {
                    setPermissionGranted(false)
                    setIsSupported(false)
                    return false
                }
            } catch (error) {
                console.error('Error requesting orientation permission:', error)
                setPermissionGranted(false)
                setIsSupported(false)
                return false
            }
        }
        return true
    }

    useEffect(() => {
        if (!permissionGranted) return

        const handleOrientation = (event) => {
            // absolute heading is alpha on deviceorientationabsolute, or webkitCompassHeading
            let compassHeading = null

            if (event.webkitCompassHeading) {
                // iOS supports webkitCompassHeading
                compassHeading = event.webkitCompassHeading
                if (event.webkitCompassAccuracy) {
                    setAccuracy(Math.round(event.webkitCompassAccuracy))
                }
            } else if (event.alpha !== null) {
                // Android supports alpha/beta/gamma. With absolute event, standard alpha is 0 at magnetic north.
                // Wait, alpha is counter-clockwise. Compass heading is clockwise.
                // So compassHeading = 360 - alpha
                compassHeading = (360 - event.alpha) % 360
                setAccuracy(event.absolute ? 10 : 30) // set placeholder accuracy
            }

            if (compassHeading !== null) {
                setHeading(Math.round(compassHeading))
            }
        }

        // Attempt to listen to absolute orientation first, then normal orientation
        if ('ondeviceorientationabsolute' in window) {
            window.addEventListener('deviceorientationabsolute', handleOrientation, true)
            return () =>
                window.removeEventListener('deviceorientationabsolute', handleOrientation, true)
        } else if ('ondeviceorientation' in window) {
            window.addEventListener('deviceorientation', handleOrientation, true)
            return () => window.removeEventListener('deviceorientation', handleOrientation, true)
        } else {
            setIsSupported(false)
        }
    }, [permissionGranted])

    return {
        heading,
        accuracy,
        isSupported,
        permissionGranted,
        requestPermission,
        isiOS
    }
}
