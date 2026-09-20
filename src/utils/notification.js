/**
 * Helper to show web notifications with fallback for mobile browsers (Android Chrome PWA)
 */
export const sendNotification = async (title, options = {}) => {
    if (typeof window === 'undefined' || !('Notification' in window)) return false
    if (Notification.permission !== 'granted') return false

    try {
        if ('serviceWorker' in navigator) {
            const reg = await navigator.serviceWorker.ready
            if (reg && reg.showNotification) {
                await reg.showNotification(title, options)
                return true
            }
        }
        new Notification(title, options)
        return true
    } catch (err) {
        console.warn('Fallback standard Notification due to error:', err)
        try {
            new Notification(title, options)
            return true
        } catch (e) {
            console.error('Failed to trigger notification:', e)
            return false
        }
    }
}
