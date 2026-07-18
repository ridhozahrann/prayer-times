/**
 * Helper functions for prayer calculations, formatting, and geographic utilities.
 */

// Coordinates of the Kaaba in Mecca
export const KAABA_LAT = 21.4225
export const KAABA_LNG = 39.8262

/**
 * Calculates the direction (bearing) of the Qibla (Kaaba) from the given coordinates.
 * Returns the bearing in degrees from North (0-360).
 */
export const calculateQiblaDirection = (lat, lng) => {
    if (lat === null || lng === null) return 0

    const latRad = (lat * Math.PI) / 180
    const lngRad = (lng * Math.PI) / 180
    const kaabaLatRad = (KAABA_LAT * Math.PI) / 180
    const kaabaLngRad = (KAABA_LNG * Math.PI) / 180

    const deltaLng = kaabaLngRad - lngRad

    const y = Math.sin(deltaLng)
    const x = Math.cos(latRad) * Math.tan(kaabaLatRad) - Math.sin(latRad) * Math.cos(deltaLng)

    let qiblaRad = Math.atan2(y, x)
    let qiblaDeg = (qiblaRad * 180) / Math.PI

    return (qiblaDeg + 360) % 360
}

/**
 * Calculates the geodesic distance (in kilometers) to the Kaaba from the given coordinates.
 */
export const calculateDistanceToKaaba = (lat, lng) => {
    if (lat === null || lng === null) return 0

    const R = 6371 // Earth radius in km
    const latRad = (lat * Math.PI) / 180
    const lngRad = (lng * Math.PI) / 180
    const kaabaLatRad = (KAABA_LAT * Math.PI) / 180
    const kaabaLngRad = (KAABA_LNG * Math.PI) / 180

    const dLat = kaabaLatRad - latRad
    const dLng = kaabaLngRad - lngRad

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(latRad) * Math.cos(kaabaLatRad) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return Math.round(R * c)
}

/**
 * Formats a JS Date object into standard Indonesian Gregorian date format.
 * Example: "Sabtu, 18 Juli 2026"
 */
export const formatGregorianDate = (date) => {
    if (!date) return ''
    return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date)
}

/**
 * Fallback Hijri date calculator if the API fails or is loading.
 * This is an approximation (Kuwaiti Algorithm variant).
 */
export const getOfflineHijriDate = (date) => {
    let jd = 0
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()

    if (month < 3) {
        year -= 1
        month += 12
    }

    const a = Math.floor(year / 100)
    const b = Math.floor(a / 4)
    const c = 2 - a + b
    const e = Math.floor(365.25 * (year + 4716))
    const f = Math.floor(30.6001 * (month + 1))
    jd = c + day + e + f - 1524.5

    const epoch = 1948439.5
    const delta = jd - epoch
    const l = Math.floor(delta / 10631)
    const n = Math.floor((delta - l * 10631) / 354.36667)
    const m = Math.floor((delta - l * 10631 - n * 354.36667) / 29.5)

    let hijriYear = Math.floor(l * 30 + n + 1)
    let hijriMonth = Math.floor(m + 1)
    let hijriDay = Math.round(delta - l * 10631 - n * 354.36667 - m * 29.5) + 1

    // Handle month boundary overflow
    if (hijriDay > 30) {
        hijriDay -= 30
        hijriMonth += 1
    }
    if (hijriMonth > 12) {
        hijriMonth -= 12
        hijriYear += 1
    }

    const hijriMonthsNames = [
        'Muharram',
        'Safar',
        'Rabiul Awal',
        'Rabiul Akhir',
        'Jumadil Awal',
        'Jumadil Akhir',
        'Rajab',
        'Sya\'ban',
        'Ramadhan',
        'Syawal',
        'Zulqa\'dah',
        'Zulhijjah',
    ]

    return `${hijriDay} ${hijriMonthsNames[hijriMonth - 1]} ${hijriYear} H`
}

/**
 * Formats seconds into HH:mm:ss countdown format.
 */
export const formatCountdown = (totalSeconds) => {
    if (totalSeconds <= 0) return '00:00:00'
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0'),
    ].join(':')
}
