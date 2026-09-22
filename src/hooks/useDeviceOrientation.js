import { useState, useEffect } from 'react'

export const useDeviceOrientation = (enabled = true) => {
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
        if (!permissionGranted || !enabled) return

        let hasReceivedData = false

        const handleOrientation = (event) => {
            let compassHeading = null

            if (typeof event.webkitCompassHeading === 'number' && !isNaN(event.webkitCompassHeading)) {
                // iOS supports webkitCompassHeading
                compassHeading = event.webkitCompassHeading
                if (typeof event.webkitCompassAccuracy === 'number') {
                    setAccuracy(Math.round(event.webkitCompassAccuracy))
                }
            } else if (event.alpha !== null && event.alpha !== undefined) {
                // Android / standard DeviceOrientation
                const screenAngle = window.screen?.orientation?.angle || window.orientation || 0
                compassHeading = (360 - event.alpha + screenAngle) % 360
                setAccuracy(event.absolute ? 10 : 30) // placeholder accuracy
            }

            if (compassHeading !== null && !isNaN(compassHeading)) {
                const normalized = (Math.round(compassHeading) + 360) % 360
                setHeading(normalized)
                if (!hasReceivedData) {
                    hasReceivedData = true
                    setIsSupported(true)
                }
            }
        }

        // Timeout check: if no orientation events with valid heading received within 1.5s, mark unsupported
        const timeoutId = setTimeout(() => {
            if (!hasReceivedData) {
                setIsSupported(false)
            }
        }, 1500)

        if ('ondeviceorientationabsolute' in window) {
            window.addEventListener('deviceorientationabsolute', handleOrientation, true)
        }
        if ('ondeviceorientation' in window) {
            window.addEventListener('deviceorientation', handleOrientation, true)
        }

        return () => {
            clearTimeout(timeoutId)
            if ('ondeviceorientationabsolute' in window) {
                window.removeEventListener('deviceorientationabsolute', handleOrientation, true)
            }
            if ('ondeviceorientation' in window) {
                window.removeEventListener('deviceorientation', handleOrientation, true)
            }
        }
    }, [permissionGranted, enabled])

    return {
        heading,
        accuracy,
        isSupported,
        permissionGranted,
        requestPermission,
        isiOS
    }
}
