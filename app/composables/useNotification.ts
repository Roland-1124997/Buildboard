export const useNotification = () => {

    const { addToast } = useToast();

    const requestPermission = async () => {

        if (!("Notification" in window) || Notification.permission !== "default") return;

        Notification.requestPermission()
            .then((permission) => {

                if (permission !== 'granted') {
                    addToast({
                        message: `notificatie permissies geweigerd!`,
                        type: "error",
                        duration: 5000,
                    })
                    return
                }

                addToast({
                    message: `Notificatie permissies verleend!`,
                    type: "success",
                    duration: 5000,
                })

                return navigator.serviceWorker.ready
            })

            .catch((error) => addToast({
                message: `Fout bij het aanvragen van notificatie permissies: ${error}`,
                type: "error",
                duration: 5000,
            }));
    };


    const showNotification = async (title: string, options?: NotificationOptions) => {

        if (!("Notification" in window) || Notification.permission !== "granted") return;
        try {
            const registration = await navigator.serviceWorker.ready;
            registration.showNotification(title, options);
        } catch (error) {
            addToast({
                message: `Fout bij het tonen van notificatie: ${error}`,
                type: "error",
                duration: 5000,
            })
        }
    };

    return { requestPermission, showNotification };

};