export default defineNuxtPlugin(() => {
    
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const passiveEvents = ['touchstart', 'touchmove', 'wheel', 'mousewheel'];

    EventTarget.prototype.addEventListener = function (
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ) {
        
        if (passiveEvents.includes(type)) {
            if (typeof options === 'boolean' || options === undefined) {
                options = {
                    capture: typeof options === 'boolean' ? options : false,
                    passive: true,
                };
            } else if (typeof options === 'object' && options.passive === undefined) {
                options.passive = true;
            }
        }

        return originalAddEventListener.call(this, type, listener, options);
    };
});
