import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { usePrayer } from '../context/PrayerContext'
import { useSettings } from '../context/SettingsContext'
import {
    IoCalendarOutline,
    IoLocationOutline,
    IoSunnyOutline,
    IoSunny,
    IoMoonOutline,
    IoMoon,
    IoCloudyNightOutline,
    IoTimeOutline,
    IoPartlySunnyOutline,
    IoChevronBackOutline,
    IoChevronForwardOutline
} from 'react-icons/io5'
import { formatGregorianDate } from '../utils/prayerHelpers'

const MONTH_NAMES_ID = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

const MONTH_NAMES_EN = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

const Jadwal = () => {
    const { coords, calculationMethod, t, language } = useSettings()
    const { timings, loading, error, activePrayer, currentTime } = usePrayer()

    const [viewMode, setViewMode] = useState('daily') // 'daily' | 'monthly'

    // Monthly state
    const [selectedYear, setSelectedYear] = useState(() => currentTime.getFullYear())
    const [selectedMonth, setSelectedMonth] = useState(() => currentTime.getMonth() + 1) // 1-12
    const [monthlyData, setMonthlyData] = useState([])
    const [monthlyLoading, setMonthlyLoading] = useState(false)
    const [monthlyError, setMonthlyError] = useState(null)

    // Localized Prayer Name Helper
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

    const prayerConfig = [
        { key: 'Fajr', icon: <IoCloudyNightOutline className="w-6 h-6" /> },
        { key: 'Sunrise', icon: <IoSunnyOutline className="w-6 h-6" /> },
        { key: 'Dhuhr', icon: <IoSunny className="w-6 h-6" /> },
        { key: 'Asr', icon: <IoPartlySunnyOutline className="w-6 h-6" /> },
        { key: 'Maghrib', icon: <IoMoonOutline className="w-6 h-6" /> },
        { key: 'Isha', icon: <IoMoon className="w-6 h-6" /> }
    ]

    // Fetch monthly schedule when in monthly mode or month/coords/calcMethod changes
    useEffect(() => {
        if (viewMode !== 'monthly' || !coords.lat || !coords.lng) return

        let isMounted = true
        setMonthlyLoading(true)
        setMonthlyError(null)

        axios.get(`https://api.aladhan.com/v1/calendar/${selectedYear}/${selectedMonth}`, {
            params: {
                latitude: coords.lat,
                longitude: coords.lng,
                method: calculationMethod
            }
        })
            .then((res) => {
                if (isMounted && res.data?.code === 200) {
                    setMonthlyData(res.data.data || [])
                }
            })
            .catch((err) => {
                console.error('Error fetching monthly prayer schedule:', err)
                if (isMounted) {
                    setMonthlyError(language === 'en' ? 'Failed to fetch monthly schedule.' : 'Gagal memuat jadwal bulanan.')
                }
            })
            .finally(() => {
                if (isMounted) setMonthlyLoading(false)
            })

        return () => { isMounted = false }
    }, [viewMode, selectedYear, selectedMonth, coords.lat, coords.lng, calculationMethod, language])

    const handlePrevMonth = () => {
        if (selectedMonth === 1) {
            setSelectedMonth(12)
            setSelectedYear(y => y - 1)
        } else {
            setSelectedMonth(m => m - 1)
        }
    }

    const handleNextMonth = () => {
        if (selectedMonth === 12) {
            setSelectedMonth(1)
            setSelectedYear(y => y + 1)
        } else {
            setSelectedMonth(m => m + 1)
        }
    }

    const monthNames = language === 'en' ? MONTH_NAMES_EN : MONTH_NAMES_ID
    const currentMonthLabel = `${monthNames[selectedMonth - 1]} ${selectedYear}`
    const todayDate = currentTime.getDate()
    const todayMonth = currentTime.getMonth() + 1
    const todayYear = currentTime.getFullYear()

    if (loading) {
        return (
            <div className="flex-1 p-4 md:p-8 space-y-6 page-fade-in max-w-4xl mx-auto w-full">
                <div className="h-6 w-48 shimmer rounded mb-4"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, idx) => (
                        <div key={idx} className="glass-card rounded-2.5xl p-6 h-36 shimmer"></div>
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center page-fade-in">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center text-red-500 mb-4">
                    <IoTimeOutline className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-2">{t('errorTitle')}</h3>
                <p className="text-sm text-zinc-500 max-w-sm mb-6">{t('gpsErrorDefault')}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
                >
                    {t('cobaLagiBtn')}
                </button>
            </div>
        )
    }

    return (
        <main className="flex-1 p-4 md:p-8 space-y-6 page-fade-in max-w-4xl mx-auto w-full pb-24 md:pb-8">
            {/* Header */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/60 pb-5">
                <div>
                    <h2 className="text-2xl font-black text-zinc-800 dark:text-white">
                        {viewMode === 'daily' ? t('fullSchedule') : t('monthlySchedule')}
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-450 mt-1 flex items-center gap-1.5 font-medium">
                        <IoCalendarOutline className="w-4 h-4 text-emerald-500" />
                        {formatGregorianDate(currentTime)}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* View Switcher Toggle */}
                    <div className="bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-2xl flex items-center border border-zinc-200/60 dark:border-zinc-700/50">
                        <button
                            onClick={() => setViewMode('daily')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${viewMode === 'daily'
                                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                                }`}
                        >
                            {t('dailyView')}
                        </button>
                        <button
                            onClick={() => setViewMode('monthly')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${viewMode === 'monthly'
                                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                                }`}
                        >
                            {t('monthlyView')}
                        </button>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 text-zinc-650 dark:text-zinc-400 bg-white/50 dark:bg-zinc-900/50 px-4 py-2 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 text-sm font-semibold shrink-0">
                        <IoLocationOutline className="w-4 h-4 text-emerald-500 animate-pulse" />
                        <span>
                            {coords.isGPS || coords.name === 'Lokasi Anda (GPS)' || coords.name === 'Your Location (GPS)'
                                ? t('lokasiAnda')
                                : coords.name}
                        </span>
                    </div>
                </div>
            </section>

            {/* Daily View Mode */}
            {viewMode === 'daily' && (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {prayerConfig.map(({ key, icon }) => {
                        const name = getPrayerName(key)
                        const time = timings ? timings[key] : '--:--'
                        const isActive = activePrayer === key

                        return (
                            <article
                                key={key}
                                className={`glass-card rounded-2.5xl p-6 transition-all duration-300 relative border flex flex-col justify-between overflow-hidden ${isActive
                                    ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                                    : 'bg-white/70 dark:bg-zinc-900/50 border-zinc-200/50 dark:border-zinc-800/40 hover:border-zinc-350 dark:hover:border-zinc-700'
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl transform translate-x-4 -translate-y-4" />
                                )}

                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        {isActive && (
                                            <span className="inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2.5 w-max">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-0.5" />
                                                {t('activeBadge')}
                                            </span>
                                        )}
                                        <h3 className={`text-lg font-extrabold ${isActive ? 'text-emerald-600 dark:text-white' : 'text-zinc-700 dark:text-zinc-100'}`}>
                                            {name}
                                        </h3>
                                    </div>
                                    <div className={`p-2.5 rounded-xl ${isActive ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25' : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-550 dark:text-zinc-400'}`}>
                                        {icon}
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-between items-baseline">
                                    <time className="text-3xl font-black text-zinc-800 dark:text-white font-display">
                                        {time}
                                    </time>
                                    {isActive && (
                                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-mono">
                                            {t('ongoing')}
                                        </span>
                                    )}
                                </div>
                            </article>
                        )
                    })}
                </section>
            )}

            {/* Monthly View Mode */}
            {viewMode === 'monthly' && (
                <section className="space-y-4">
                    {/* Month Picker Controls */}
                    <div className="glass-card rounded-2.5xl p-4 border border-zinc-200/50 dark:border-zinc-800/40 bg-white/70 dark:bg-zinc-900/50 flex items-center justify-between">
                        <button
                            onClick={handlePrevMonth}
                            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                            aria-label={t('prevMonth')}
                        >
                            <IoChevronBackOutline className="w-5 h-5" />
                        </button>
                        <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-100 font-display">
                            {currentMonthLabel}
                        </span>
                        <button
                            onClick={handleNextMonth}
                            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                            aria-label={t('nextMonth')}
                        >
                            <IoChevronForwardOutline className="w-5 h-5" />
                        </button>
                    </div>

                    {monthlyLoading ? (
                        <div className="glass-card rounded-2.5xl p-8 space-y-3 shimmer">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-8 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-lg"></div>
                            ))}
                        </div>
                    ) : monthlyError ? (
                        <div className="text-center p-8 bg-red-500/10 text-red-500 rounded-2.5xl">
                            {monthlyError}
                        </div>
                    ) : (
                        <div className="glass-card rounded-2.5xl border border-zinc-200/50 dark:border-zinc-800/40 bg-white/70 dark:bg-zinc-900/50 overflow-hidden shadow-lg">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs md:text-sm">
                                    <thead className="bg-zinc-100/80 dark:bg-zinc-800/60 border-b border-zinc-200/60 dark:border-zinc-800/60 text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                                        <tr>
                                            <th className="p-3.5 pl-5">{t('dateHeader')}</th>
                                            <th className="p-3.5">{getPrayerName('Fajr')}</th>
                                            <th className="p-3.5">{getPrayerName('Sunrise')}</th>
                                            <th className="p-3.5">{getPrayerName('Dhuhr')}</th>
                                            <th className="p-3.5">{getPrayerName('Asr')}</th>
                                            <th className="p-3.5">{getPrayerName('Maghrib')}</th>
                                            <th className="p-3.5 pr-5">{getPrayerName('Isha')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-200/40 dark:divide-zinc-800/40 font-medium">
                                        {monthlyData.map((dayItem, idx) => {
                                            const dayNum = parseInt(dayItem.date.gregorian.day, 10)
                                            const isToday = dayNum === todayDate && selectedMonth === todayMonth && selectedYear === todayYear
                                            const t = dayItem.timings

                                            const clean = (str) => str ? str.split(' ')[0] : '--:--'

                                            return (
                                                <tr
                                                    key={idx}
                                                    className={`transition-colors ${isToday
                                                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-extrabold'
                                                        : 'hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300'
                                                        }`}
                                                >
                                                    <td className="p-3.5 pl-5 flex items-center gap-2 whitespace-nowrap">
                                                        <span>{dayItem.date.gregorian.day} {dayItem.date.gregorian.weekday.en.slice(0, 3)}</span>
                                                        {isToday && (
                                                            <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                                Hari Ini
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-3.5 whitespace-nowrap font-mono">{clean(t.Fajr)}</td>
                                                    <td className="p-3.5 whitespace-nowrap font-mono text-zinc-400 dark:text-zinc-500">{clean(t.Sunrise)}</td>
                                                    <td className="p-3.5 whitespace-nowrap font-mono">{clean(t.Dhuhr)}</td>
                                                    <td className="p-3.5 whitespace-nowrap font-mono">{clean(t.Asr)}</td>
                                                    <td className="p-3.5 whitespace-nowrap font-mono">{clean(t.Maghrib)}</td>
                                                    <td className="p-3.5 pr-5 whitespace-nowrap font-mono">{clean(t.Isha)}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </section>
            )}
        </main>
    )
}

export default Jadwal