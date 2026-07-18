import React from 'react'
import { IoSunny, IoMoon, IoLocation, IoNotifications, IoNotificationsOff } from 'react-icons/io5'
import { useTheme } from '../context/ThemeContext'
import { useSettings } from '../context/SettingsContext'

const Navbar = () => {
    const { theme, toggleTheme } = useTheme()
    const { coords, notificationsEnabled, setNotificationsEnabled, t } = useSettings()

    const toggleNotifications = async () => {
        if (!notificationsEnabled) {
            // Request permission
            if (typeof window !== 'undefined' && 'Notification' in window) {
                const permission = await Notification.requestPermission()
                if (permission === 'granted') {
                    setNotificationsEnabled(true)
                    new Notification(t('notifActiveTitle'), {
                        body: t('notifActiveBody'),
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

    return (
        <header className="sticky top-0 z-30 w-full bg-white/70 dark:bg-zinc-950/60 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/40 px-4 md:px-8 py-3.5 flex items-center justify-between">
            {/* Brand logo for Mobile view only */}
            <div className="flex items-center gap-2 md:hidden">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow shadow-emerald-500/10 text-white font-bold text-base">
                    P
                </div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                    {t('appName')}
                </h1>
            </div>

            {/* Location indicators - works on both desktop/mobile */}
            <div className="hidden md:flex items-center gap-2 text-zinc-650 dark:text-zinc-400">
                <IoLocation className="w-4.5 h-4.5 text-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-450 dark:text-zinc-500 mr-1">{t('wilayah')}:</span>
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{coords.name || t('menentukan')}</span>
            </div>

            {/* Mobile Location Header */}
            <div className="md:hidden flex items-center gap-1 text-zinc-700 dark:text-zinc-300 max-w-[50%] truncate">
                <IoLocation className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-semibold truncate">
                    {coords.name === 'Lokasi Anda (GPS)' || coords.name === 'Your Location (GPS)'
                        ? t('lokasiAnda')
                        : coords.name?.split(',')[0] || t('menentukan')}
                </span>
            </div>

            {/* Controls: theme toggler and notification settings */}
            <div className="flex items-center gap-2">
                {/* Notification toggle widget */}
                <button
                    onClick={toggleNotifications}
                    className={`p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-300 ${notificationsEnabled
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500'
                        : 'text-zinc-450 dark:text-zinc-500 hover:bg-zinc-150 dark:hover:bg-zinc-800'
                        }`}
                    title={notificationsEnabled ? t('notifActiveTitle') : 'Toggle Notification'}
                    aria-label="Toggle notifications"
                >
                    {notificationsEnabled ? (
                        <IoNotifications className="w-4.5 h-4.5 animate-bell" />
                    ) : (
                        <IoNotificationsOff className="w-4.5 h-4.5" />
                    )}
                </button>

                {/* Dark Mode toggle for mobile (hidden on desktop because it is inside Sidebar) */}
                <button
                    onClick={toggleTheme}
                    className="md:hidden p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-655 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                    aria-label="Toggle theme mode"
                >
                    {theme === 'dark' ? (
                        <IoSunny className="w-4.5 h-4.5 text-amber-500" />
                    ) : (
                        <IoMoon className="w-4.5 h-4.5 text-indigo-500" />
                    )}
                </button>
            </div>
        </header>
    )
}

export default Navbar
