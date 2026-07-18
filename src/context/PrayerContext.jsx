import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useSettings } from './SettingsContext'
import { getOfflineHijriDate } from '../utils/prayerHelpers'

const PrayerContext = createContext()

const PRAYER_NAMES = {
    Fajr: 'Subuh',
    Sunrise: 'Terbit',
    Dhuhr: 'Dzuhur',
    Asr: 'Ashar',
    Maghrib: 'Maghrib',
    Isha: 'Isya'
}

export const PrayerProvider = ({ children }) => {
    const { coords, calculationMethod, notificationsEnabled, t, language } = useSettings()

    const [timings, setTimings] = useState(null)
    const [hijriDate, setHijriDate] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Realtime Time State
    const [currentTime, setCurrentTime] = useState(new Date())
    const [activePrayer, setActivePrayer] = useState(null)
    const [nextPrayer, setNextPrayer] = useState(null)
    const [countdown, setCountdown] = useState(0) // seconds remaining
    const [activeRemaining, setActiveRemaining] = useState(0) // seconds active prayer will end in

    // Ref to store last triggered notification prayer to avoid duplicates
    const lastNotifiedRef = useRef('')

    // 1. Clock Update Loop
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    // 2. Fetch Timing from Aladhan API
    useEffect(() => {
        let isMounted = true

        const fetchTimings = async () => {
            if (!coords.lat || !coords.lng) return

            setLoading(true)
            setError(null)

            try {
                const today = new Date()
                const day = String(today.getDate()).padStart(2, '0')
                const month = String(today.getMonth() + 1).padStart(2, '0')
                const year = today.getFullYear()

                const response = await axios.get(
                    `https://api.aladhan.com/v1/timings/${day}-${month}-${year}`,
                    {
                        params: {
                            latitude: coords.lat,
                            longitude: coords.lng,
                            method: calculationMethod
                        }
                    }
                )

                if (response.data?.code === 200 && isMounted) {
                    const data = response.data.data
                    setTimings(data.timings)

                    // Hijri Date
                    const hijriObj = data.date.hijri
                    const hijriStr = `${hijriObj.day} ${hijriObj.month.en} ${hijriObj.year} H`
                    // Translate English month names to Indonesian standard if preferred
                    const monthsMap = {
                        'Muharram': 'Muharram',
                        'Safar': 'Safar',
                        'Rabīʿ al-awwal': 'Rabiul Awal',
                        'Rabīʿ ath-thānī': 'Rabiul Akhir',
                        'Jumādā al-ūlā': 'Jumadil Awal',
                        'Jumādā al-ākhirah': 'Jumadil Akhir',
                        'Rajab': 'Rajab',
                        'Shaʿbān': 'Sya\'ban',
                        'Ramaḍān': 'Ramadhan',
                        'Shawwāl': 'Syawal',
                        'Dhū al-Qaʿdah': 'Zulqa\'dah',
                        'Dhū al-Ḥijjah': 'Zulhijjah',
                        // Simple string matching fallback
                        'Rabī\' al-awwal': 'Rabiul Awal',
                        'Rabī\' ath-thānī': 'Rabiul Akhir',
                        'Jumādā al-awwal': 'Jumadil Awal',
                        'Jumādā ath-thāniya': 'Jumadil Akhir',
                        'Sha\'bān': 'Sya\'ban',
                        'Dhū l-Qa\'da': 'Zulqa\'dah',
                        'Dhū l-Ḥijja': 'Zulhijjah'
                    }
                    let customHijriMonth = hijriObj.month.en
                    Object.keys(monthsMap).forEach(key => {
                        if (hijriObj.month.en.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(hijriObj.month.en.toLowerCase())) {
                            customHijriMonth = monthsMap[key]
                        }
                    })
                    setHijriDate(`${hijriObj.day} ${customHijriMonth} ${hijriObj.year} H`)
                }
            } catch (err) {
                console.error('Gagal mengambil jadwal sholat:', err)
                if (isMounted) {
                    setError('Gagal memuat jadwal sholat. Pastikan koneksi internet aktif.')
                    // Use offline fallback dates
                    setHijriDate(getOfflineHijriDate(new Date()))
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        fetchTimings()

        return () => {
            isMounted = false
        }
    }, [coords.lat, coords.lng, calculationMethod])

    // 3. Engine to calculate active, next, countdown, and trigger notifications
    useEffect(() => {
        if (!timings) return

        const now = currentTime
        const parseTimeToDate = (timeStr, baseDate) => {
            const cleanTime = timeStr.split(' ')[0]
            const [hours, minutes] = cleanTime.split(':').map(Number)
            const d = new Date(baseDate)
            d.setHours(hours, minutes, 0, 0)
            return d
        }

        // Set up milestones using dates
        const today = new Date(now)
        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)

        // Key milestones list
        const milestones = [
            { key: 'Isha', time: parseTimeToDate(timings.Isha, yesterday), isYesterday: true },
            { key: 'Fajr', time: parseTimeToDate(timings.Fajr, today) },
            { key: 'Sunrise', time: parseTimeToDate(timings.Sunrise, today) },
            { key: 'Dhuhr', time: parseTimeToDate(timings.Dhuhr, today) },
            { key: 'Asr', time: parseTimeToDate(timings.Asr, today) },
            { key: 'Maghrib', time: parseTimeToDate(timings.Maghrib, today) },
            { key: 'Isha', time: parseTimeToDate(timings.Isha, today) },
            { key: 'Fajr', time: parseTimeToDate(timings.Fajr, tomorrow), isTomorrow: true }
        ]

        // Find current active slot
        let activeIndex = -1
        for (let i = 0; i < milestones.length - 1; i++) {
            if (now >= milestones[i].time && now < milestones[i + 1].time) {
                activeIndex = i
                break
            }
        }

        if (activeIndex !== -1) {
            const activeSlot = milestones[activeIndex]
            const nextSlot = milestones[activeIndex + 1]

            setActivePrayer(activeSlot.key)
            setNextPrayer(nextSlot.key)

            // Seconds remaining to the next milestone
            const timeRemaining = Math.max(0, Math.floor((nextSlot.time - now) / 1000))
            setCountdown(timeRemaining)
            setActiveRemaining(timeRemaining)

            // 4. Trigger browser notification.
            // We check if the next prayer time has just arrived (countdown == 0).
            // Or to avoid missing it, we trigger when countdown is between 0 and 1 seconds.
            // Only do this for actual prayers (exclude Sunrise from notification alerts unless requested, but let's notify for actual prayers: Fajr, Dhuhr, Asr, Maghrib, Isha).
            if (timeRemaining <= 1 && nextSlot.key !== 'Sunrise' && notificationsEnabled) {
                const getPrayerName = (key) => {
                    const mapping = {
                        Fajr: language === 'en' ? 'Fajr' : 'Subuh',
                        Sunrise: language === 'en' ? 'Sunrise' : 'Terbit',
                        Dhuhr: language === 'en' ? 'Dhuhr' : 'Dzuhur',
                        Asr: language === 'en' ? 'Asr' : 'Ashar',
                        Maghrib: 'Maghrib',
                        Isha: language === 'en' ? 'Isha' : 'Isya'
                    }
                    return mapping[key] || key
                }
                const localizedPrayerName = getPrayerName(nextSlot.key)
                const uniqueNotificationKey = `${nextSlot.key}_${nextSlot.time.getTime()}`

                if (lastNotifiedRef.current !== uniqueNotificationKey) {
                    lastNotifiedRef.current = uniqueNotificationKey

                    if (Notification.permission === 'granted') {
                        const locationName = coords.name === 'Lokasi Anda (GPS)' || coords.name === 'Your Location (GPS)'
                            ? t('lokasiAnda')
                            : coords.name
                        new Notification(t('waktuAdzanTiba'), {
                            body: language === 'en'
                                ? `Time for ${localizedPrayerName} has arrived for ${locationName}.`
                                : `Waktu ${localizedPrayerName} telah tiba untuk wilayah ${locationName}.`,
                            icon: '/icons/logo.svg',
                            tag: 'adzan-notification',
                            requireInteraction: true
                        })
                    }
                }
            }
        }
    }, [timings, currentTime, notificationsEnabled, coords.name])

    return (
        <PrayerContext.Provider
            value={{
                timings,
                hijriDate,
                loading,
                error,
                currentTime,
                activePrayer,
                nextPrayer,
                countdown,
                activeRemaining,
                prayerNames: PRAYER_NAMES
            }}
        >
            {children}
        </PrayerContext.Provider>
    )
}

export const usePrayer = () => useContext(PrayerContext)
