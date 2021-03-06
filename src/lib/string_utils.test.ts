import {assertEquals} from "https://deno.land/std/testing/asserts.ts";
import StringUtils from './string_utils.ts';

Deno.test('should check if textContainsChars', () => {
    assertEquals(StringUtils.textContainsAtLeastOneChar('abc', 'xyz'), false)
    assertEquals(StringUtils.textContainsAtLeastOneChar('abc', 'cde'), true)
})

Deno.test('humanizeMillis', () => {
    assertEquals(StringUtils.humanizeMillis(MillisBuilder.newMillis().hours(50).minutes(35).seconds(28).millis(75).build()),
        "50h 35min 28.075s");

    assertEquals(StringUtils.humanizeMillis(MillisBuilder.newMillis().hours(2).minutes(35).seconds(28).millis(75).build()),
        "2h 35min 28.075s");

    assertEquals(StringUtils.humanizeMillis(MillisBuilder.newMillis().hours(2).minutes(35).seconds(28).build()),
        "2h 35min 28s");

    assertEquals(StringUtils.humanizeMillis(MillisBuilder.newMillis().hours(2).minutes(35).millis(75).build()),
        "2h 35min 0.075s");

    assertEquals(StringUtils.humanizeMillis(MillisBuilder.newMillis().hours(2).minutes(35).build()),
        "2h 35min");

    assertEquals(StringUtils.humanizeMillis(MillisBuilder.newMillis().hours(2).build()),
        "2h");

    assertEquals(StringUtils.humanizeMillis(MillisBuilder.newMillis().minutes(35).build()),
        "35min");

    assertEquals(StringUtils.humanizeMillis(MillisBuilder.newMillis().seconds(28).millis(75).build()),
        "28.075s");

    assertEquals(StringUtils.humanizeMillis(MillisBuilder.newMillis().seconds(28).build()),
        "28s");

    assertEquals(StringUtils.humanizeMillis(MillisBuilder.newMillis().millis(75).build()),
        "0.075s");

    assertEquals(StringUtils.humanizeMillis(MillisBuilder.newMillis().build()),
        "0.000s");

    assertEquals(StringUtils.humanizeMillis(0.029),
        "0.000s");
});

class MillisBuilder {
    private static readonly SECONDS = 1000;
    private static readonly MINUTES = 60 * MillisBuilder.SECONDS;
    private static readonly HOURS = 60 * MillisBuilder.MINUTES;

    private _hours = 0;
    private _minutes = 0;
    private _seconds = 0;
    private _millis = 0;

    public MillisBuilder() {
    }

    public static newMillis(): MillisBuilder {
        return new MillisBuilder();
    }

    public hours(hours: number): MillisBuilder {
        this._hours = hours;
        return this;
    }

    public minutes(minutes: number): MillisBuilder {
        this._minutes = minutes;
        return this;
    }

    public seconds(seconds: number): MillisBuilder {
        this._seconds = seconds;
        return this;
    }

    public millis(millis: number): MillisBuilder {
        this._millis = millis;
        return this;
    }

    public build(): number {
        return this._hours * MillisBuilder.HOURS + this._minutes * MillisBuilder.MINUTES + this._seconds * MillisBuilder.SECONDS + this._millis;
    }
}

//
// parseBoolean
//
Deno.test('should parse true', () => {
    assertEquals(StringUtils.parseBoolean(true), true)
    assertEquals(StringUtils.parseBoolean('true'), true)
    assertEquals(StringUtils.parseBoolean('1'), true)
    assertEquals(StringUtils.parseBoolean(1), true)
    assertEquals(StringUtils.parseBoolean(123), true)
    assertEquals(StringUtils.parseBoolean('any text'), true)
})
Deno.test('should parse false', () => {
    assertEquals(StringUtils.parseBoolean(false), false)
    assertEquals(StringUtils.parseBoolean('false'), false)
    assertEquals(StringUtils.parseBoolean('0'), false)
    assertEquals(StringUtils.parseBoolean(0), false)
    assertEquals(StringUtils.parseBoolean(undefined), false)
    assertEquals(StringUtils.parseBoolean(null), false)
})
