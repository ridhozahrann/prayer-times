import React from 'react'
import { Link } from 'react-router-dom'
import { usePrayer } from '../context/PrayerContext'
import { useSettings } from '../context/SettingsContext'
import { formatGregorianDate, formatCountdown } from '../utils/prayerHelpers'
import { IoTimeOutline, IoLocationOutline, IoCalendarOutline, IoChevronForwardCircleOutline } from 'react-icons/io5'

const Home = () => {
    const { coords, t, language } = useSettings()
    const {
        timings,
        hijriDate,
        loading,
        error,
        currentTime,
        activePrayer,
        nextPrayer,
        countdown,
        prayerNames
    } = usePrayer()

    // Format digital clock
    const hours = String(currentTime.getHours()).padStart(2, '0')
    const minutes = String(currentTime.getMinutes()).padStart(2, '0')
    const seconds = String(currentTime.getSeconds()).padStart(2, '0')

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

    // Skeleton Loader for Home Page
    if (loading) {
        return (
            <div className="flex-1 p-4 md:p-8 space-y-6 page-fade-in max-w-4xl mx-auto w-full">
                {/* Skeleton Clock */}
                <div className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center space-y-4">
                    <div className="h-6 w-32 shimmer rounded"></div>
                    <div className="h-16 w-60 shimmer rounded-2xl"></div>
                    <div className="h-4 w-48 shimmer rounded"></div>
                </div>

                {/* Skeleton Focus Card */}
                <div className="glass-card rounded-3xl p-8 space-y-4">
                    <div className="h-4 w-24 shimmer rounded"></div>
                    <div className="h-8 w-48 shimmer rounded"></div>
                    <div className="h-14 w-full shimmer rounded-2xl"></div>
                </div>

                {/* Skeleton Quick Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card rounded-2xl p-4 h-24 shimmer"></div>
                    <div className="glass-card rounded-2xl p-4 h-24 shimmer"></div>
                </div>
            </div>
        )
    }

    // Error state
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

    const activePrayerName = getPrayerName(activePrayer)
    const nextPrayerName = getPrayerName(nextPrayer)
    const nextPrayerTime = timings ? timings[nextPrayer] : ''

    return (
        <main className="flex-1 p-4 md:p-8 space-y-6 page-fade-in max-w-4xl mx-auto w-full pb-24 md:pb-8">
            {/* 1. Header & Digital Clock Widget */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-700/80 dark:to-zinc-900/90 text-white p-6 md:p-8 shadow-xl shadow-emerald-500/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-400/20 rounded-full blur-3xl transform -translate-x-12 translate-y-12" />

                <div className="relative flex flex-col items-center text-center">
                    <div className="flex items-center gap-1.5 text-emerald-105 bg-white/10 dark:bg-zinc-800/40 px-3 py-1 rounded-full text-xs font-semibold tracking-wide backdrop-blur-md mb-4 border border-white/5">
                        <IoLocationOutline className="w-3.5 h-3.5" />
                        <span>
                            {coords.name === 'Lokasi Anda (GPS)' || coords.name === 'Your Location (GPS)'
                                ? t('lokasiAnda')
                                : coords.name?.split(',')[0]}
                        </span>
                    </div>

                    <div className="font-display text-4xl md:text-5xl font-extrabold tracking-wide drop-shadow-md select-all">
                        {hours}<span className="animate-pulse">:</span>{minutes}<span className="text-2xl md:text-3xl font-medium text-emerald-250 ml-1">{seconds}</span>
                    </div>

                    <div className="mt-4 flex flex-col md:flex-row items-center gap-2 md:gap-4 text-emerald-50 text-xs md:text-sm font-semibold opacity-95">
                        <span className="flex items-center gap-1">
                            <IoCalendarOutline className="w-4 h-4" />
                            {formatGregorianDate(currentTime)}
                        </span>
                        <span className="hidden md:inline text-white/30">|</span>
                        <span className="bg-emerald-600/30 px-2 py-0.5 rounded-md border border-emerald-400/20">{hijriDate}</span>
                    </div>
                </div>
            </section>

            {/* 2. Primary Next Prayer Card with Realtime Countdown */}
            <section className="glass-card rounded-3xl p-6 md:p-8 border border-zinc-200/50 dark:border-zinc-800/40 shadow-lg relative overflow-hidden bg-white/70 dark:bg-zinc-900/50">
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
                    <div>
                        <span className="text-xs font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase block mb-1">
                            {t('nextPrayerLabel')}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                            {nextPrayerName}
                            <span className="text-lg md:text-xl font-medium text-zinc-400 dark:text-zinc-550 ml-1">
                                ({nextPrayerTime})
                            </span>
                        </h2>
                        <div className="mt-2 text-xs md:text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                            {activePrayer ? (
                                <p>
                                    {language === 'en' ? (
                                        <>Now <span className="text-emerald-500 font-bold">{activePrayerName}</span> is in progress</>
                                    ) : (
                                        <>Sekarang <span className="text-emerald-500 font-bold">{activePrayerName}</span> sedang berlangsung</>
                                    )}
                                </p>
                            ) : (
                                <p>{language === 'en' ? 'Calculating schedules...' : 'Membaca jadwal sholat...'}</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-zinc-100/80 dark:bg-zinc-800/50 dark:border-zinc-700/35 border border-zinc-200/40 p-4 md:px-6 md:py-4 rounded-2xl flex flex-col items-center md:items-end justify-center shrink-0">
                        <span className="text-[10px] md:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">
                            {language === 'en' ? `Time to ${nextPrayerName}` : `Menuju ${nextPrayerName}`}
                        </span>
                        <div className="font-display text-2xl md:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-wide">
                            {formatCountdown(countdown)}
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Detailed Status Cards Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Active Prayer Highlight Widget */}
                <div className="glass-card rounded-2.5xl p-5 border border-zinc-200/50 dark:border-zinc-800/40 flex items-center justify-between bg-white/70 dark:bg-zinc-900/50 shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-inner">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider block">{t('prayerStatus')}</span>
                            <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-200">
                                {activePrayerName} {t('ongoing')}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">{t('endsIn')}</span>
                        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 font-mono">
                            {formatCountdown(countdown)}
                        </span>
                    </div>
                </div>

                {/* Quick link button to Full Prayer Times Page */}
                <Link
                    to="/jadwal"
                    className="glass-card rounded-2.5xl p-5 border border-zinc-200/50 dark:border-zinc-800/40 flex items-center justify-between bg-white/70 dark:bg-zinc-900/50 shadow-md hover:border-emerald-500/30 group transition-all duration-300"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/10">
                            <IoTimeOutline className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider block">{t('dailyCalendar')}</span>
                            <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-500 transition-colors">
                                {t('fullSchedule')}
                            </span>
                        </div>
                    </div>
                    <IoChevronForwardCircleOutline className="w-7 h-7 text-zinc-350 dark:text-zinc-650 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all duration-300 shrink-0" />
                </Link>
            </section>
        </main>
    )
}

export default Home
