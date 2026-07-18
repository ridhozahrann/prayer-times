import React, { useEffect } from 'react'
import { useSettings, CALCULATION_METHODS } from '../context/SettingsContext'
import { indonesiaRegions } from '../data/indonesiaRegions'
import { useTheme } from '../context/ThemeContext'
import { IoSettingsOutline, IoLocationOutline, IoNotificationsOutline, IoColorPaletteOutline, IoRefreshOutline, IoInformationCircleOutline, IoGlobeOutline } from 'react-icons/io5'

const Settings = () => {
    const {
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
        gpsError,
        gpsLoading,
        fetchGPSLocation,
        notificationsEnabled,
        setNotificationsEnabled
    } = useSettings()

    const { theme, setTheme } = useTheme()

    // Get available provinces & cities
    const provinces = Object.keys(indonesiaRegions)
    const availableCities = indonesiaRegions[manualProvince] || []

    const handleProvinceChange = (e) => {
        const prov = e.target.value
        setManualProvince(prov)
        // Auto-select first city in that province
        const firstCity = indonesiaRegions[prov][0]?.name || ''
        setManualCity(firstCity)
    }

    const handleCityChange = (e) => {
        setManualCity(e.target.value)
    }

    const toggleNotifications = async () => {
        if (!notificationsEnabled) {
            if ('Notification' in window) {
                const permission = await Notification.requestPermission()
                if (permission === 'granted') {
                    setNotificationsEnabled(true)
                    new Notification(t('notifAllowTitle'), {
                        body: t('notifAllowBody'),
                        icon: '/icons/logo.svg'
                    })
                } else {
                    alert(t('notifDeniedError'))
                }
            } else {
                alert(t('notifNoSupportError'))
            }
        } else {
            setNotificationsEnabled(false)
        }
    }

    // Trigger test notification
    const triggerTestNotification = () => {
        if (Notification.permission === 'granted') {
            new Notification(t('ujiPemberitahuanTitle'), {
                body: t('ujiPemberitahuanBody'),
                icon: '/icons/logo.svg'
            })
        } else {
            alert(t('notifDeniedError'))
        }
    }

    const getMethodName = (id, name) => {
        const mapping = t('methodsTitle')
        return mapping[id] || name
    }

    return (
        <main className="flex-1 p-4 md:p-8 space-y-6 page-fade-in max-w-4xl mx-auto w-full pb-24 md:pb-8">
            {/* Header */}
            <section className="border-b border-zinc-200 dark:border-zinc-800/80 pb-5">
                <h2 className="text-2xl font-black text-zinc-850 dark:text-zinc-150 flex items-center gap-2">
                    <IoSettingsOutline className="w-7 h-7 text-emerald-500" />
                    {t('appSettings')}
                </h2>
                <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                    {t('appSettingsDesc')}
                </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Location Settings Card */}
                <div className="glass-card rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/40 shadow-lg bg-white/70 dark:bg-zinc-900/50 space-y-6">
                    <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                        <IoLocationOutline className="w-5 h-5 text-emerald-500" />
                        {t('wilayah')}
                    </h3>

                    {/* GPS Toggle */}
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 block">{t('geoAuto')}</label>
                            <span className="text-xs text-zinc-450 dark:text-zinc-500">{t('geoAutoDesc')}</span>
                        </div>
                        <button
                            onClick={() => setUseGPS(!useGPS)}
                            className={`relative inline-flex h-6.5 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${useGPS ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'
                                }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${useGPS ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Location Loading & Errors Info */}
                    {useGPS && (
                        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2.5xl p-4 space-y-2">
                            <div className="flex justify-between items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                <span className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full bg-emerald-500 ${gpsLoading ? 'animate-ping' : ''}`} />
                                    {gpsLoading ? t('satelliteAccess') : t('gpsActive')}
                                </span>
                                {!gpsLoading && (
                                    <button
                                        onClick={fetchGPSLocation}
                                        className="p-1.5 hover:bg-emerald-505/10 rounded-lg transition-colors border border-emerald-500/20"
                                        title="Reload GPS"
                                    >
                                        <IoRefreshOutline className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-mono">
                                Lat: {coords.lat.toFixed(6)}, Lng: {coords.lng.toFixed(6)}
                            </span>
                            <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 block">
                                {coords.name === 'Lokasi Anda (GPS)' || coords.name === 'Your Location (GPS)'
                                    ? t('lokasiAnda')
                                    : coords.name}
                            </span>
                            {gpsError && (
                                <span className="text-[11px] text-red-500 dark:text-red-400 font-semibold block">{gpsError}</span>
                            )}
                        </div>
                    )}

                    {/* Manual Select Options (Disabled when GPS active) */}
                    {!useGPS && (
                        <div className="space-y-4">
                            {/* Province Picker */}
                            <div className="space-y-1.5">
                                <label htmlFor="province-select" className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider block">{t('provinceLabel')}</label>
                                <select
                                    id="province-select"
                                    value={manualProvince}
                                    onChange={handleProvinceChange}
                                    className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-zinc-700 dark:text-zinc-300 cursor-pointer"
                                >
                                    {provinces.map((prov) => (
                                        <option key={prov} value={prov}>
                                            {prov}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* City Picker */}
                            <div className="space-y-1.5">
                                <label htmlFor="city-select" className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider block">{t('cityLabel')}</label>
                                <select
                                    id="city-select"
                                    value={manualCity}
                                    onChange={handleCityChange}
                                    className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-zinc-700 dark:text-zinc-300 cursor-pointer"
                                >
                                    {availableCities.map((city) => (
                                        <option key={city.name} value={city.name}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Prayer calculation Method Card */}
                <div className="glass-card rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/40 shadow-lg bg-white/70 dark:bg-zinc-900/50 space-y-6">
                    <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                        <IoSettingsOutline className="w-5 h-5 text-emerald-500" />
                        {t('calcMethodLabel')}
                    </h3>

                    <div className="space-y-1.5">
                        <label htmlFor="calc-method-select" className="text-sm font-bold text-zinc-700 dark:text-zinc-300 block">{t('calcMethodLabel')}</label>
                        <span className="text-xs text-zinc-450 dark:text-zinc-500 block mb-3">{t('calcMethodDesc')}</span>
                        <select
                            id="calc-method-select"
                            value={calculationMethod}
                            onChange={(e) => setCalculationMethod(e.target.value)}
                            className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-zinc-700 dark:text-zinc-300 cursor-pointer"
                        >
                            {CALCULATION_METHODS.map((method) => (
                                <option key={method.id} value={method.id}>
                                    {getMethodName(method.id, method.name)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200/40 dark:border-zinc-800/40 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-zinc-505 dark:text-zinc-400 font-medium">
                        <IoInformationCircleOutline className="w-5 h-5 text-emerald-500 shrink-0" />
                        <div>
                            <span className="font-bold text-zinc-700 dark:text-zinc-300 block mb-0.5">{t('referenceMethodId')}</span>
                            {t('referenceMethodIdDesc')}
                        </div>
                    </div>
                </div>

                {/* 3. Notifications Switch */}
                <div className="glass-card rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/40 shadow-lg bg-white/70 dark:bg-zinc-900/50 space-y-6">
                    <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                        <IoNotificationsOutline className="w-5 h-5 text-emerald-500" />
                        {t('adhanNotif')}
                    </h3>

                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 block">{t('pemberitahuanWaktu')}</label>
                            <span className="text-xs text-zinc-450 dark:text-zinc-505">{t('adhanNotifDesc')}</span>
                        </div>
                        <button
                            onClick={toggleNotifications}
                            className={`relative inline-flex h-6.5 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${notificationsEnabled ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-705'
                                }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {notificationsEnabled && (
                        <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200/40 dark:border-zinc-800/40 rounded-2.5xl p-4 w-full">
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">{t('verifyNotif')}</span>
                            <button
                                onClick={triggerTestNotification}
                                className="px-3.5 py-1.5 border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white text-xs font-semibold rounded-xl transition-all duration-300"
                            >
                                {t('testNotifBtn')}
                            </button>
                        </div>
                    )}
                </div>

                {/* 4. Language Selector Card */}
                <div className="glass-card rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/40 shadow-lg bg-white/70 dark:bg-zinc-900/50 space-y-6">
                    <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                        <IoGlobeOutline className="w-5 h-5 text-emerald-500" />
                        {t('languageLabel')}
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setLanguage('id')}
                            className={`py-3.5 rounded-xl border text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${language === 'id'
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-450 shadow-inner'
                                : 'border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                                }`}
                        >
                            🇮🇩 Indonesia
                        </button>

                        <button
                            onClick={() => setLanguage('en')}
                            className={`py-3.5 rounded-xl border text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${language === 'en'
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold shadow-inner'
                                : 'border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                                }`}
                        >
                            🇬🇧 English
                        </button>
                    </div>
                </div>

                {/* 5. Color Theme Manual Selector */}
                <div className="glass-card rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/40 shadow-lg bg-white/70 dark:bg-zinc-900/50 space-y-6 md:col-span-2">
                    <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                        <IoColorPaletteOutline className="w-5 h-5 text-emerald-500" />
                        {t('appTheme')}
                    </h3>

                    <div className="grid grid-cols-2 gap-3 animate-fade-in">
                        <button
                            onClick={() => setTheme('light')}
                            className={`py-3.5 rounded-xl border text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${theme === 'light'
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-650 dark:text-emerald-450 shadow-inner'
                                : 'border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                                }`}
                        >
                            ☀️ {t('lightModeLabel')}
                        </button>

                        <button
                            onClick={() => setTheme('dark')}
                            className={`py-3.5 rounded-xl border text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${theme === 'dark'
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold shadow-inner'
                                : 'border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                                }`}
                        >
                            🌙 {t('darkModeLabel')}
                        </button>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Settings
