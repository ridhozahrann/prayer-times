import React from 'react'
import { usePrayer } from '../context/PrayerContext'
import { IoCalendarOutline, IoLocationOutline, IoSunnyOutline, IoSunny, IoMoonOutline, IoMoon, IoCloudyNightOutline, IoTimeOutline, IoPartlySunnyOutline } from 'react-icons/io5'
import { formatGregorianDate } from '../utils/prayerHelpers'
import { useSettings } from '../context/SettingsContext'

const Jadwal = () => {
    const { coords, t, language } = useSettings()
    const { timings, loading, error, activePrayer, currentTime } = usePrayer()

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

    // Icons matching prayer types
    const prayerConfig = [
        {
            key: 'Fajr',
            icon: <IoCloudyNightOutline className="w-6 h-6" />
        },
        {
            key: 'Sunrise',
            icon: <IoSunnyOutline className="w-6 h-6" />
        },
        {
            key: 'Dhuhr',
            icon: <IoSunny className="w-6 h-6" />
        },
        {
            key: 'Asr',
            icon: <IoPartlySunnyOutline className="w-6 h-6" />
        },
        {
            key: 'Maghrib',
            icon: <IoMoonOutline className="w-6 h-6" />
        },
        {
            key: 'Isha',
            icon: <IoMoon className="w-6 h-6" />
        }
    ]

    // Loading skeleton layout
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

    // Error layout
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
            {/* Detail Headers */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/60 pb-5">
                <div>
                    <h2 className="text-2xl font-black text-zinc-800 dark:text-white">
                        {t('fullSchedule')}
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-450 mt-1 flex items-center gap-1.5 font-medium">
                        <IoCalendarOutline className="w-4 h-4 text-emerald-500" />
                        {formatGregorianDate(currentTime)}
                    </p>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-650 dark:text-zinc-400 bg-white/50 dark:bg-zinc-900/50 px-4 py-2 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 text-sm font-semibold shrink-0">
                    <IoLocationOutline className="w-4 h-4 text-emerald-500 animate-pulse" />
                    <span>
                        {coords.name === 'Lokasi Anda (GPS)' || coords.name === 'Your Location (GPS)'
                            ? t('lokasiAnda')
                            : coords.name}
                    </span>
                </div>
            </section>

            {/* Prayers Cards Grid */}
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
                            {/* Highlight background elements for active items */}
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
        </main>
    )
}

export default Jadwal
