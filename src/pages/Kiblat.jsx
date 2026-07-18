import React, { useState, useEffect } from 'react'
import { useDeviceOrientation } from '../hooks/useDeviceOrientation'
import { useSettings } from '../context/SettingsContext'
import { calculateQiblaDirection, calculateDistanceToKaaba } from '../utils/prayerHelpers'
import { IoCompassOutline, IoLocationOutline, IoNavigateCircle, IoRefreshOutline, IoWarningOutline } from 'react-icons/io5'

const Kiblat = () => {
    const { coords, t, language } = useSettings()
    const {
        heading,
        accuracy,
        isSupported,
        permissionGranted,
        requestPermission,
        isiOS
    } = useDeviceOrientation()

    const [qiblaDirection, setQiblaDirection] = useState(0)
    const [distance, setDistance] = useState(0)
    const [manualHeading, setManualHeading] = useState(0) // manual support for desktop testing

    // Calculate direction & distance to Kaaba
    useEffect(() => {
        if (coords.lat && coords.lng) {
            const qDir = calculateQiblaDirection(coords.lat, coords.lng)
            const dist = calculateDistanceToKaaba(coords.lat, coords.lng)
            setQiblaDirection(qDir)
            setDistance(dist)
        }
    }, [coords])

    // Get active heading (sensor heading if supported & granted, else manual desktop fallback)
    const activeHeading = isSupported && permissionGranted ? heading : manualHeading

    // Qibla needle rotation (relative to phone top pointer): (QiblaDeg - heading)
    const qiblaRelativeAngle = (qiblaDirection - activeHeading + 360) % 360

    const getAccuracyLabel = (acc) => {
        if (acc === null) return t('tidakTerdeteksi')
        if (acc <= 10) return t('highAccuracy')
        if (acc <= 30) return t('normalAccuracy')
        return t('lowAccuracy')
    }

    const getAccuracyColor = (acc) => {
        if (acc === null) return 'text-zinc-400 dark:text-zinc-500'
        if (acc <= 10) return 'text-emerald-500 font-semibold'
        if (acc <= 30) return 'text-amber-500 font-semibold'
        return 'text-red-500 font-semibold animate-pulse'
    }

    return (
        <main className="flex-1 p-4 md:p-8 space-y-6 page-fade-in max-w-4xl mx-auto w-full pb-24 md:pb-8">
            {/* Detail Headers */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-5">
                <div>
                    <h2 className="text-2xl font-black text-zinc-800 dark:text-zinc-150">
                        {t('kiblat')}
                    </h2>
                    <p className="text-sm text-zinc-505 dark:text-zinc-400 mt-1 font-medium">
                        {language === 'en' ? 'Face your device towards the Qibla using compass orientation.' : 'Hadapkan perangkat ke arah kiblat menggunakan orientasi kompas.'}
                    </p>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-650 dark:text-zinc-400 bg-white/50 dark:bg-zinc-900/50 px-4 py-2 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 text-sm font-semibold shrink-0">
                    <IoLocationOutline className="w-4 h-4 text-emerald-500 animate-pulse" />
                    <span>
                        {coords.name === 'Lokasi Anda (GPS)' || coords.name === 'Your Location (GPS)'
                            ? t('lokasiAnda')
                            : coords.name?.split(',')[0]}
                    </span>
                </div>
            </section>

            {/* Main Interactive Compass Screen */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Compass Dial Card */}
                <div className="md:col-span-2 glass-card rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center border border-zinc-200/50 dark:border-zinc-800/40 shadow-lg bg-white/70 dark:bg-zinc-900/50">

                    {/* Geolocation/Sensor Requests for iOS */}
                    {isiOS && !permissionGranted && (
                        <div className="text-center mb-6 max-w-sm">
                            <IoWarningOutline className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                            <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">{t('sensorCompassIos')}</h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
                                {t('sensorReqDesc')}
                            </p>
                            <button
                                onClick={requestPermission}
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-colors shadow-lg shadow-emerald-500/10"
                            >
                                {t('allowSensor')}
                            </button>
                        </div>
                    )}

                    {/* DeviceOrientation unsupported Notification fallback */}
                    {!isSupported && (
                        <div className="mb-6 w-full max-w-sm bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 flex gap-3 text-amber-600 dark:text-amber-400">
                            <IoWarningOutline className="w-5 h-5 shrink-0" />
                            <div className="text-xs font-medium">
                                <span className="font-bold block mb-0.5">{language === 'en' ? 'Auto Compass Disabled' : 'Kompas Otomatis Nonaktif'}</span>
                                {t('manualInstruction')}
                            </div>
                        </div>
                    )}

                    {/* Beautiful SVG Compass Visualizer */}
                    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-6">

                        {/* Phone Top Align Indicator */}
                        <div className="absolute top-0 w-2.5 h-6 bg-red-500 rounded-full z-20 shadow-md shadow-red-500/30" />
                        <div className="absolute top-7 text-[9px] font-bold text-red-500 uppercase tracking-widest z-20">{language === 'en' ? 'FRONT' : 'DEPAN'}</div>

                        {/* Glowing active Qibla guide arc */}
                        {Math.abs(qiblaRelativeAngle) < 5 && (
                            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 animate-ping opacity-25 z-0" />
                        )}

                        {/* Rotating Outer Dial (Points to Magnetic North) */}
                        <div
                            className="absolute inset-2 rounded-full border-2 border-zinc-200/60 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-950/40 transition-transform duration-300 flex items-center justify-center shadow-inner"
                            style={{ transform: `rotate(${-activeHeading}deg)` }}
                        >
                            {/* Compass Cardinal Directions */}
                            <div className="absolute top-[8px] font-display font-extrabold text-sm text-red-500">{language === 'en' ? 'N' : 'U'}</div>
                            <div className="absolute right-[8px] font-display font-extrabold text-sm text-zinc-500 dark:text-zinc-400">{language === 'en' ? 'E' : 'T'}</div>
                            <div className="absolute bottom-[8px] font-display font-extrabold text-sm text-zinc-550 dark:text-zinc-400">{language === 'en' ? 'S' : 'S'}</div>
                            <div className="absolute left-[8px] font-display font-extrabold text-sm text-zinc-500 dark:text-zinc-400">{language === 'en' ? 'W' : 'B'}</div>

                            {/* Ticks ring */}
                            <div className="w-full h-full rounded-full border border-dashed border-zinc-300/40 dark:border-zinc-700/30 absolute" />
                        </div>

                        {/* Rotating Inner Qibla Arrow (Points to Kaaba) */}
                        <div
                            className="absolute w-24 h-24 md:w-32 md:h-32 transition-transform duration-300 flex items-center justify-center z-10"
                            style={{ transform: `rotate(${qiblaRelativeAngle}deg)` }}
                        >
                            {/* Needle pointer */}
                            <div className="w-1.5 h-20 md:h-28 bg-gradient-to-t from-emerald-500 via-teal-400 to-emerald-500 rounded-full flex flex-col justify-start items-center shadow-lg shadow-emerald-500/10">
                                <IoNavigateCircle className="w-8 h-8 text-emerald-500 -mt-3.5 transform -rotate-45 block shadow-lg bg-white dark:bg-zinc-950 rounded-full" />
                            </div>
                        </div>

                        {/* Inner Center Hub */}
                        <div className="absolute w-12 h-12 rounded-full bg-white dark:bg-zinc-900 border-4 border-emerald-500/20 dark:border-zinc-800/80 flex items-center justify-center shadow-md z-15">
                            <span className="font-extrabold text-xs font-display text-emerald-500">🕋</span>
                        </div>
                    </div>

                    {/* Compass aligned label */}
                    <div className="text-center z-10">
                        {Math.abs(qiblaRelativeAngle) < 3 ? (
                            <span className="bg-emerald-500 text-white font-extrabold text-xs tracking-wider uppercase px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/20 animate-bounce">
                                🟢 {t('qiblaAligned')}
                            </span>
                        ) : (
                            <span className="bg-zinc-150 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 font-extrabold text-xs tracking-wider uppercase px-4 py-1.5 rounded-full border border-zinc-200/50 dark:border-zinc-700/30">
                                {t('rotDeviceMessage')}
                            </span>
                        )}
                    </div>

                    {/* Manual test slider (if compass API unsupported or desktop testing) */}
                    {!isSupported && (
                        <div className="w-full max-w-sm mt-8 space-y-2 border-t border-zinc-200/50 dark:border-zinc-850/40 pt-4">
                            <div className="flex justify-between text-[11px] font-semibold text-zinc-400 dark:text-zinc-550 uppercase">
                                <span>{t('simHeadingHeading')}</span>
                                <span>{activeHeading}°</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="359"
                                value={manualHeading}
                                onChange={(e) => setManualHeading(Number(e.target.value))}
                                className="w-full h-1.5 accent-emerald-500 rounded-lg bg-zinc-200 dark:bg-zinc-800 cursor-pointer"
                            />
                        </div>
                    )}
                </div>

                {/* Informative Stats Card */}
                <div className="glass-card rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/40 shadow-lg bg-white/70 dark:bg-zinc-900/50 flex flex-col justify-between">
                    <div className="space-y-6">
                        <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                            {language === 'en' ? 'Geographic Calculations' : 'Kalkulasi Geografis'}
                        </h3>

                        {/* Qibla Angle */}
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wide block">{t('compassBearing')}</span>
                                <span className="text-zinc-800 dark:text-zinc-202 text-sm font-semibold">{t('compassFromNorth')}</span>
                            </div>
                            <div className="text-right">
                                <span className="font-display font-black text-xl text-emerald-500">
                                    {qiblaDirection.toFixed(2)}°
                                </span>
                            </div>
                        </div>

                        {/* Device Angle */}
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wide block">{t('arahPerangkat')}</span>
                                <span className="text-zinc-800 dark:text-zinc-202 text-sm font-semibold">{t('headingSaatIni')}</span>
                            </div>
                            <div className="text-right">
                                <span className="font-display font-medium text-lg text-zinc-700 dark:text-zinc-300">
                                    {activeHeading}°
                                </span>
                            </div>
                        </div>

                        {/* Distance to Kaaba */}
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wide block">{t('jarakKeKaabah')}</span>
                                <span className="text-zinc-800 dark:text-zinc-202 text-sm font-semibold">{t('garisHaversine')}</span>
                            </div>
                            <div className="text-right">
                                <span className="font-display font-black text-xl text-emerald-500">
                                    {distance.toLocaleString(language === 'en' ? 'en-US' : 'id-ID')} km
                                </span>
                            </div>
                        </div>

                        {/* Accuracy status */}
                        <div className="flex justify-between items-center border-t border-zinc-100 dark:border-zinc-800 pt-4">
                            <div>
                                <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wide block">{t('accuracyLabel')}</span>
                                <span className="text-zinc-850 dark:text-zinc-202 text-sm font-medium">{t('akurasiKompas')}</span>
                            </div>
                            <div className="text-right text-xs">
                                <span className={getAccuracyColor(accuracy)}>
                                    {getAccuracyLabel(accuracy)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Compass Help Text */}
                    <div className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200/50 dark:border-zinc-800/40 rounded-2xl p-4 mt-6">
                        <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 mb-1">
                            💡 {t('precisionTips')}
                        </h4>
                        <ul className="text-[10.5px] text-zinc-500 dark:text-zinc-450 space-y-1 leading-relaxed list-disc list-inside">
                            <li>{t('tip1')}</li>
                            <li>{t('tip2')}</li>
                            <li>{t('tip3')}</li>
                        </ul>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Kiblat
