import React, { useState, useEffect } from 'react'
import { useSettings } from '../context/SettingsContext'
import { IoDownloadOutline, IoClose } from 'react-icons/io5'

const InstallPrompt = () => {
    const { language } = useSettings()
    const [deferredPrompt, setDeferredPrompt] = useState(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const handleBeforeInstall = (e) => {
            e.preventDefault()
            setDeferredPrompt(e)
            setVisible(true)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstall)

        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
    }, [])

    const handleInstall = async () => {
        if (!deferredPrompt) return
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') {
            setVisible(false)
        }
        setDeferredPrompt(null)
    }

    if (!visible) return null

    return (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2.5 flex items-center justify-between shadow-md text-xs font-medium z-40 sticky top-0">
            <div className="flex items-center gap-2">
                <IoDownloadOutline className="w-4 h-4 text-emerald-200 animate-bounce" />
                <span>
                    {language === 'en'
                        ? 'Install Prayer Times app for offline access & faster load!'
                        : 'Pasang aplikasi Jadwal Sholat untuk akses offline & lebih cepat!'}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={handleInstall}
                    className="bg-white text-emerald-700 hover:bg-emerald-50 px-3 py-1 rounded-lg font-bold text-xs transition-colors shadow-sm"
                >
                    {language === 'en' ? 'Install' : 'Pasang'}
                </button>
                <button
                    onClick={() => setVisible(false)}
                    className="p-1 hover:bg-white/20 rounded-md transition-colors text-white/80"
                    aria-label="Close install prompt"
                >
                    <IoClose className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

export default InstallPrompt