import React from 'react'
import { NavLink } from 'react-router-dom'
import { IoHome, IoHomeOutline, IoTime, IoTimeOutline, IoCompass, IoCompassOutline, IoSettings, IoSettingsOutline, IoSunny, IoMoon } from 'react-icons/io5'
import { useTheme } from '../context/ThemeContext'
import { useSettings } from '../context/SettingsContext'

const Sidebar = () => {
    const { theme, toggleTheme } = useTheme()
    const { t } = useSettings()

    const navItems = [
        {
            to: '/',
            label: t('home'),
            iconActive: <IoHome className="w-5.5 h-5.5" />,
            iconInactive: <IoHomeOutline className="w-5.5 h-5.5" />
        },
        {
            to: '/jadwal',
            label: t('jadwal'),
            iconActive: <IoTime className="w-5.5 h-5.5" />,
            iconInactive: <IoTimeOutline className="w-5.5 h-5.5" />
        },
        {
            to: '/kiblat',
            label: t('kiblat'),
            iconActive: <IoCompass className="w-5.5 h-5.5" />,
            iconInactive: <IoCompassOutline className="w-5.5 h-5.5" />
        },
        {
            to: '/settings',
            label: t('settings'),
            iconActive: <IoSettings className="w-5.5 h-5.5" />,
            iconInactive: <IoSettingsOutline className="w-5.5 h-5.5" />
        }
    ]

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-zinc-200/50 dark:border-zinc-800/40 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md p-6 z-40">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-xl">
                    P
                </div>
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent leading-none">
                        {t('appName')}
                    </h1>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-550 font-semibold tracking-wider uppercase">{t('jadwal')} &amp; {t('kiblat')}</span>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold shadow-inner'
                                : 'text-zinc-650 dark:text-zinc-450 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                                    {isActive ? item.iconActive : item.iconInactive}
                                </span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Dark Mode and Footer Settings */}
            <div className="mt-auto space-y-4">
                <button
                    onClick={toggleTheme}
                    className="flex items-center gap-4 w-full px-4 py-3 rounded-xl border border-zinc-205/60 dark:border-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all duration-300"
                    aria-label="Toggle Dark Mode"
                >
                    {theme === 'dark' ? (
                        <>
                            <IoSunny className="w-5.5 h-5.5 text-amber-500" />
                            <span className="text-sm font-medium">{t('lightModeLabel')}</span>
                        </>
                    ) : (
                        <>
                            <IoMoon className="w-5.5 h-5.5 text-indigo-500" />
                            <span className="text-sm font-medium">{t('darkModeLabel')}</span>
                        </>
                    )}
                </button>
                <div className="text-[11px] text-zinc-400 dark:text-zinc-550 text-center font-medium">
                    {t('appName')} &copy; 2026
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
