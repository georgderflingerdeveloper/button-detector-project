const SHORT_MAX = 1000;
const LONG_MIN = 2000;
const ULTRA_LONG_MIN = 5000;
const DOUBLE_MAX_GAP = 2000;

class ButtonEventDetector {

    constructor() {
        this.pressStart = null;
        this.pendingShort = false;
        this.shortTimerTs = 0;
    }

    input(state, now) {

        const events = [];

        // BUTTON DOWN = PRESS
        if (state === true) {
            this.pressStart = now;
            return events;
        }

        // BUTTON UP = RELEASE
        if (state === false && this.pressStart !== null) {

            const duration = now - this.pressStart;

            this.pressStart = null;

            // ULTRA LONG
            if (duration >= ULTRA_LONG_MIN) {

                this.pendingShort = false;

                events.push({
                    topic: 'button_right_entry_ultralongpush',
                    duration_ms: duration
                });

                return events;
            }

            // LONG
            if (duration >= LONG_MIN) {

                this.pendingShort = false;

                events.push({
                    topic: 'button_right_entry_longpush',
                    duration_ms: duration
                });

                return events;
            }

            // SHORT
            if (duration < SHORT_MAX) {

                // second short -> double
                if (this.pendingShort) {

                    this.pendingShort = false;

                    events.push({
                        topic: 'button_right_entry_doublepush',
                        duration_ms: duration
                    });

                    return events;
                }

                // first short
                this.pendingShort = true;
                this.shortTimerTs = now;

                return events;
            }
        }

        return events;
    }

    processTimers(now) {

        const events = [];

        if (
            this.pendingShort &&
            (now - this.shortTimerTs) >= DOUBLE_MAX_GAP
        ) {

            this.pendingShort = false;

            events.push({
                topic: 'button_right_entry_shortpush'
            });
        }

        return events;
    }
}

module.exports = ButtonEventDetector;
