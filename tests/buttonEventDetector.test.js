const ButtonEventDetector = require('../src/buttonEventDetector');

describe('ButtonEventDetector', () => {

    test('detect short push', () => {

        const det = new ButtonEventDetector();

        det.input(true, 0);
        det.input(false, 500);

        const ev = det.processTimers(3000);

        expect(ev[0].topic)
            .toBe('button_right_entry_shortpush');
    });

    test('detect double push', () => {

        const det = new ButtonEventDetector();

        det.input(true, 0);
        det.input(false, 200);

        det.input(true, 500);
        const ev = det.input(false, 700);

        expect(ev[0].topic)
            .toBe('button_right_entry_doublepush');
    });

    test('detect long push', () => {

        const det = new ButtonEventDetector();

        det.input(true, 0);

        const ev = det.input(false, 3000);

        expect(ev[0].topic)
            .toBe('button_right_entry_longpush');
    });

    test('detect ultra long push', () => {

        const det = new ButtonEventDetector();

        det.input(true, 0);

        const ev = det.input(false, 6000);

        expect(ev[0].topic)
            .toBe('button_right_entry_ultralongpush');
    });

});
