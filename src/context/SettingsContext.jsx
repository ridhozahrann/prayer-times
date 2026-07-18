import React, { createContext, useContext, useState, useEffect } from 'react'
import { indonesiaRegions } from '../data/indonesiaRegions'

const SettingsContext = createContext()

export const CALCULATION_METHODS = [
    { id: '20', name: 'Kementerian Agama RI' },
    { id: '3', name: 'Muslim World League' },
    { id: '4', name: 'Umm Al-Qura University' },
    { id: '5', name: 'Egyptian General Authority' },
    { id: '2', name: 'ISNA (North America)' },
    { id: '1', name: 'Karachi (Univ of Islamic Sciences)' },
    { id: '11', name: 'Singapore MUIS' }
]

const TRANSLATIONS = {
    id: {
        appName: 'Prayer Times',
        home: 'Beranda',
        jadwal: 'Jadwal Sholat',
        kiblat: 'Arah Kiblat',
        settings: 'Pengaturan',
        wilayah: 'Wilayah',
        menentukan: 'Menentukan...',
        lokasiAnda: 'Lokasi Anda (GPS)',
        clockTime: 'Jam',
        dateGregorian: 'Tanggal Gregorian',
        hijriDateLabel: 'Tanggal Hijriah',
        nextPrayerLabel: 'Sholat Berikutnya',
        activePrayerLabel: 'Sedang Berlangsung',
        secondsLabel: 'detik',
        prayerStatus: 'Status Sholat',
        endsIn: 'Selesai Dalam',
        ongoing: 'Sedang Berlangsung',
        dailyCalendar: 'Kalender Harian',
        fullSchedule: 'Seluruh Jadwal Sholat',
        compassBearing: 'Sudut Kiblat',
        compassFromNorth: 'Dari Arah Utara',
        distanceToKaaba: 'Jarak ke Ka\'bah',
        accuracyLabel: 'Ketepatan Sensor',
        highAccuracy: 'Tinggi (Presisi)',
        normalAccuracy: 'Sedang (Normal)',
        lowAccuracy: 'Rendah (Kalibrasi Kompas)',
        qiblaAligned: 'Kiblat Selaras',
        sensorCompassIos: 'Sensor Kompas iOS',
        sensorReqDesc: 'iOS Apple mewajibkan persetujuan eksplisit untuk mengizinkan aplikasi membaca sensor gerakan perangkat.',
        allowSensor: 'Izinkan Sensor',
        rotDeviceMessage: 'Putar Perangkat Anda',
        simHeadingHeading: 'Simulasi Arah Ponsel',
        manualInstruction: 'Perangkat ini belum mendukung sensor kompas otomatis. Gunakan slider di bawah untuk memutar kompas secara manual.',
        precisionTips: 'Tips Presisi',
        tip1: 'Posisikan ponsel Anda sejajar mendatar di telapak tangan.',
        tip2: 'Jauhkan dari benda logam, besi magnetik, atau charger laptop.',
        tip3: 'Jika arah kompas menyimpang, putar ponsel membentuk pola angka 8 untuk kalibrasi ulang.',
        appSettings: 'Pengaturan Aplikasi',
        appSettingsDesc: 'Kelola parameter perhitungan waktu shalat, wilayah regional, tema, dan preferensi notifikasi.',
        geoAuto: 'Deteksi Lokasi Otomatis (GPS)',
        geoAutoDesc: 'Gunakan GPS ponsel untuk presisi mutlak',
        satelliteAccess: 'Mengakses Koordinat Satelit...',
        gpsActive: 'GPS Aktif',
        gpsErrorNoSupport: 'Geolocation tidak didukung oleh browser ini.',
        gpsErrorDefault: 'Gagal mengakses GPS.',
        gpsErrorDenied: 'Izin lokasi ditolak. Silakan pilih lokasi secara manual.',
        provinceLabel: 'Provinsi',
        cityLabel: 'Kota / Kabupaten',
        calcMethodLabel: 'Metode Hisab',
        calcMethodDesc: 'Sesuaikan derajat kemiringan matahari untuk jadwal sholat',
        referenceMethodId: 'Metode Rujukan Indonesia',
        referenceMethodIdDesc: 'Metode Kementerian Agama RI merupakan standar hisab resmi Indonesia dengan parameter elongasi hilal / sudut tinggi matahari di Indonesia (Fajr/Subuh 20°, Isha/Isya 18°).',
        pemberitahuanWaktu: 'Pemberitahuan Waktu',
        adhanNotif: 'Notifikasi Adzan',
        adhanNotifDesc: 'Kirim notifikasi browser (Adzan)',
        verifyNotif: 'Verifikasi bahwa sistem notifikasi berfungsi',
        testNotifBtn: 'Uji Notifikasi',
        appTheme: 'Tema Aplikasi',
        lightModeLabel: 'Mode Terang',
        darkModeLabel: 'Mode Gelap',
        languageLabel: 'Bahasa',
        selectLanguage: 'Pilih Bahasa',
        ujiPemberitahuanTitle: 'Uji Coba Notifikasi',
        ujiPemberitahuanBody: 'Halo! Ini adalah contoh pemberitahuan adzan dari Prayer Times.',
        notifActiveTitle: 'Notifikasi Aktif',
        notifActiveBody: 'Anda akan menerima pemberitahuan saat waktu shalat tiba.',
        notifAllowTitle: 'Notifikasi Diizinkan',
        notifAllowBody: 'Selamat! Pemberitahuan adzan akan dikirim bertepatan waktu shalat.',
        notifDeniedError: 'Akses notifikasi diblokir. Harap izinkan notifikasi melalui pengaturan browser.',
        notifNoSupportError: 'Browser Anda tidak mendukung Web Notifications.',
        activeBadge: 'Aktif',
        testAlertTitle: 'Waktu Sholat Tiba',
        testAlertBody: 'Waktu $\{name\} telah tiba untuk wilayah $\{location\}.',
        cobaLagiBtn: 'Coba Lagi',
        errorTitle: 'Terjadi Kesalahan',
        loadingText: 'Memuat Jadwal...',
        methodsTitle: {
            '20': 'Kementerian Agama RI',
            '3': 'Muslim World League',
            '4': 'Umm Al-Qura',
            '5': 'Egyptian General Authority',
            '2': 'ISNA (North America)',
            '1': 'Karachi Univ Sciences',
            '11': 'Singapore MUIS'
        }
    },
    en: {
        appName: 'Prayer Times',
        home: 'Home',
        jadwal: 'Prayer Times',
        kiblat: 'Qibla Direction',
        settings: 'Settings',
        wilayah: 'Region',
        menentukan: 'Detecting...',
        lokasiAnda: 'Your Location (GPS)',
        clockTime: 'Clock',
        dateGregorian: 'Gregorian Date',
        hijriDateLabel: 'Hijri Date',
        nextPrayerLabel: 'Next Prayer',
        activePrayerLabel: 'In Progress',
        secondsLabel: 'seconds',
        prayerStatus: 'Prayer Status',
        endsIn: 'Ends In',
        ongoing: 'Ongoing',
        dailyCalendar: 'Daily Calendar',
        fullSchedule: 'All Prayer Times',
        compassBearing: 'Qibla Angle',
        compassFromNorth: 'From North Direction',
        distanceToKaaba: 'Distance to Kaaba',
        accuracyLabel: 'Sensor Accuracy',
        highAccuracy: 'High (Precise)',
        normalAccuracy: 'Medium (Normal)',
        lowAccuracy: 'Low (Calibrate Compass)',
        qiblaAligned: 'Qibla Aligned',
        sensorCompassIos: 'iOS Compass Sensor',
        sensorReqDesc: 'Apple iOS requires explicit permission to allow reading device motion sensors.',
        allowSensor: 'Allow Sensor',
        rotDeviceMessage: 'Rotate Your Device',
        simHeadingHeading: 'Simulated Phone Heading',
        manualInstruction: 'This device does not support compass sensors automatically. Use the slider below to rotate manually.',
        precisionTips: 'Precision Tips',
        tip1: 'Place your phone flat in the palm of your hand.',
        tip2: 'Keep away from metal objects, magnetic cases, or laptop chargers.',
        tip3: 'If the compass drifts, draw a figure-8 pattern with your phone to recalibrate.',
        appSettings: 'App Settings',
        appSettingsDesc: 'Manage prayer times calculations, active regions, theme modes, and notification preferences.',
        geoAuto: 'Auto Geolocation (GPS)',
        geoAutoDesc: 'Use device GPS location for absolute precision',
        satelliteAccess: 'Retrieving Satellite Coords...',
        gpsActive: 'GPS Active',
        gpsErrorNoSupport: 'Geolocation is not supported by this browser.',
        gpsErrorDefault: 'Failed to access GPS.',
        gpsErrorDenied: 'Location permission denied. Please choose a location manually.',
        provinceLabel: 'Province',
        cityLabel: 'City / Regency',
        calcMethodLabel: 'Calculation Method',
        calcMethodDesc: 'Adjust the solar angles used to calculate prayer times',
        referenceMethodId: 'Indonesian Reference Standard',
        referenceMethodIdDesc: 'Ministry of Religious Affairs (Kemenag RI) standard is the Indonesian official method using Fajr 20° and Isha 18°.',
        pemberitahuanWaktu: 'Time Notification',
        adhanNotif: 'Adhan Alerts',
        adhanNotifDesc: 'Send browser push notifications (Adhan)',
        verifyNotif: 'Verify that the notification system is working',
        testNotifBtn: 'Test Notification',
        appTheme: 'App Theme',
        lightModeLabel: 'Light Mode',
        darkModeLabel: 'Dark Mode',
        languageLabel: 'Language',
        selectLanguage: 'Select Language',
        ujiPemberitahuanTitle: 'Notification Test',
        ujiPemberitahuanBody: 'Hello! This is a sample adhan notification from Prayer Times.',
        notifActiveTitle: 'Notifications Active',
        notifActiveBody: 'You will receive notifications when prayer times arrive.',
        notifAllowTitle: 'Notifications Enabled',
        notifAllowBody: 'Congratulations! You will receive adhan alerts on time.',
        notifDeniedError: 'Notification access blocked. Please enable it in browser settings.',
        notifNoSupportError: 'Your browser does not support Web Notifications.',
        activeBadge: 'Active',
        testAlertTitle: 'Prayer Time Arrived',
        testAlertBody: 'Time for $\{name\} has arrived for $\{location\}.',
        cobaLagiBtn: 'Try Again',
        errorTitle: 'An Error Occurred',
        loadingText: 'Loading Schedules...',
        methodsTitle: {
            '20': 'Ministry of Religious Affairs ID',
            '3': 'Muslim World League',
            '4': 'Umm Al-Qura University',
            '5': 'Egyptian General Authority',
            '2': 'ISNA (North America)',
            '1': 'Karachi Univ Sciences',
            '11': 'Singapore MUIS'
        }
    }
}

export const SettingsProvider = ({ children }) => {
    const [calculationMethod, setCalculationMethod] = useState(() => {
        return localStorage.getItem('calcMethod') || '20'
    })

    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('language')
        if (saved) return saved
        const locale = navigator.language || 'en'
        return locale.toLowerCase().startsWith('id') ? 'id' : 'en'
    })

    const [useGPS, setUseGPS] = useState(() => {
        const saved = localStorage.getItem('useGPS')
        return saved === null ? true : saved === 'true'
    })

    const [manualProvince, setManualProvince] = useState(() => {
        return localStorage.getItem('manualProvince') || 'DKI Jakarta'
    })

    const [manualCity, setManualCity] = useState(() => {
        return localStorage.getItem('manualCity') || 'Jakarta Pusat'
    })

    const [coords, setCoords] = useState(() => {
        const savedCoords = localStorage.getItem('coords')
        if (savedCoords) {
            try {
                return JSON.parse(savedCoords)
            } catch (e) {
                // Fallback below
            }
        }
        // Default coordinates (Jakarta Pusat)
        return { lat: -6.1805, lng: 106.8284, name: 'Jakarta Pusat, DKI Jakarta' }
    })

    const [gpsError, setGpsError] = useState(null)
    const [gpsLoading, setGpsLoading] = useState(false)

    const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
        const saved = localStorage.getItem('notificationsEnabled')
        return saved === 'true'
    })

    // Synchronize base values with localStorage
    useEffect(() => {
        localStorage.setItem('calcMethod', calculationMethod)
    }, [calculationMethod])

    useEffect(() => {
        localStorage.setItem('language', language)
    }, [language])

    useEffect(() => {
        localStorage.setItem('useGPS', useGPS.toString())
    }, [useGPS])

    useEffect(() => {
        localStorage.setItem('manualProvince', manualProvince)
    }, [manualProvince])

    useEffect(() => {
        localStorage.setItem('manualCity', manualCity)
    }, [manualCity])

    useEffect(() => {
        localStorage.setItem('coords', JSON.stringify(coords))
    }, [coords])

    useEffect(() => {
        localStorage.setItem('notificationsEnabled', notificationsEnabled.toString())
    }, [notificationsEnabled])

    // Get GPS Coordinates
    const fetchGPSLocation = () => {
        if (!navigator.geolocation) {
            setGpsError(t('gpsErrorNoSupport'))
            setUseGPS(false)
            return
        }

        setGpsLoading(true)
        setGpsError(null)

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                setCoords({
                    lat: latitude,
                    lng: longitude,
                    name: language === 'id' ? 'Lokasi Anda (GPS)' : 'Your Location (GPS)'
                })
                setGpsLoading(false)
            },
            (error) => {
                let msg = t('gpsErrorDefault')
                if (error.code === error.PERMISSION_DENIED) {
                    msg = t('gpsErrorDenied')
                }
                setGpsError(msg)
                setGpsLoading(false)
                setUseGPS(false) // fallback to manual
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        )
    }

    // Translation function
    const t = (key) => {
        return TRANSLATIONS[language]?.[key] || TRANSLATIONS['id']?.[key] || key
    }

    // Effect to handle GPS flow
    useEffect(() => {
        if (useGPS) {
            fetchGPSLocation()
        } else {
            // Load manual coordinates
            const province = indonesiaRegions[manualProvince]
            if (province) {
                const cityObj = province.find(c => c.name === manualCity) || province[0]
                if (cityObj) {
                    setCoords({
                        lat: cityObj.lat,
                        lng: cityObj.lng,
                        name: `${cityObj.name}, ${manualProvince}`
                    })
                }
            }
        }
    }, [useGPS, manualProvince, manualCity, language])

    return (
        <SettingsContext.Provider
            value={{
                calculationMethod,
                setCalculationMethod,
                language,
                setLanguage,
                t,
                useGPS,
                setUseGPS,
                manualProvince,
                setManualProvince,
                manualCity,
                setManualCity,
                coords,
                setCoords,
                gpsError,
                gpsLoading,
                fetchGPSLocation,
                notificationsEnabled,
                setNotificationsEnabled
            }}
        >
            {children}
        </SettingsContext.Provider>
    )
}

export const useSettings = () => useContext(SettingsContext)
