import React from 'react'
import { NavLink } from 'react-router-dom'
import { IoHome, IoHomeOutline, IoTime, IoTimeOutline, IoCompass, IoCompassOutline, IoSettings, IoSettingsOutline } from 'react-icons/io5'
import { useSettings } from '../context/SettingsContext'

const BottomNav = () => {
    const { t, language } = useSettings()

    const navItems = [
        {
            to: '/',
            label: t('home'),
            iconActive: <IoHome className="w-5 h-5" />,
            iconInactive: <IoHomeOutline className="w-5 h-5" />
        },
        {
            to: '/jadwal',
            label: language === 'en' ? 'Times' : 'Jadwal',
            iconActive: <IoTime className="w-5 h-5" />,
            iconInactive: <IoTimeOutline className="w-5 h-5" />
        },
        {
            to: '/kiblat',
            label: language === 'en' ? 'Qibla' : 'Kiblat',
            iconActive: <IoCompass className="w-5 h-5" />,
            iconInactive: <IoCompassOutline className="w-5 h-5" />
        },
        {
            to: '/settings',
            label: language === 'en' ? 'Settings' : 'Atur',
            iconActive: <IoSettings className="w-5 h-5" />,
            iconInactive: <IoSettingsOutline className="w-5 h-5" />
        }
    ]

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb- safe-bottom pt-2">
            <div className="glass-card flex items-center justify-around h-16 rounded-2xl shadow-xl px-2 border-zinc-200/50 dark:border-zinc-800/40 mb-3 bg-white/70 dark:bg-zinc-900/70">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all duration-300 relative ${isActive
                                ? 'text-emerald-500 font-semibold'
                                : 'text-zinc-450 dark:text-zinc-550 hover:text-zinc-650 dark:hover:text-zinc-300'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`transform transition-transform duration-300 ${isActive ? 'scale-110 -translate-y-0.5' : ''}`}>
                                    {isActive ? item.iconActive : item.iconInactive}
                                </span>
                                <span className="text-[10px] mt-1 font-medium tracking-wide">
                                    {item.label}
                                </span>
                                {isActive && (
                                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    )
}

export default BottomNav
