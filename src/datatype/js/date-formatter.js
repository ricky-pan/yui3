/**
 * The Date formatter utility implements strftime formatters for javascript based on the 
 * Open Group specification defined at
 * http://www.opengroup.org/onlinepubs/007908799/xsh/strftime.html
 * This implementation does not include modified conversion specifiers (i.e., Ex and Ox)
 *
 * The following format specifiers are supported:
 *
 * \copydoc formats
 *
 * \par Usage:
 * This library may be used as follows:
 * \code
 *	TODO
 * \endcode
 *
 *
 * @module datatype
 * @requires oop
 * @title DataType Date Formatter Submodule
 */

(function() {

var xPad=function (x, pad, r)
{
    if(typeof r === 'undefined')
    {
        r=10;
    }
    for( ; parseInt(x, 10)<r && r>1; r/=10) {
        x = pad.toString() + x;
    }
    return x.toString();
};


/**
 * Date subclass for the YUI DataType utility.
 * @class DataType.Date
 * @requires base
 * @static
 */
var Dt = {
    formats: {
        a: function (d, l) { return l.a[d.getDay()]; },
        A: function (d, l) { return l.A[d.getDay()]; },
        b: function (d, l) { return l.b[d.getMonth()]; },
        B: function (d, l) { return l.B[d.getMonth()]; },
        C: function (d) { return xPad(parseInt(d.getFullYear()/100, 10), 0); },
        d: ['getDate', '0'],
        e: ['getDate', ' '],
        g: function (d) { return xPad(parseInt(Dt.formats.G(d)%100, 10), 0); },
        G: function (d) {
                var y = d.getFullYear();
                var V = parseInt(Dt.formats.V(d), 10);
                var W = parseInt(Dt.formats.W(d), 10);
    
                if(W > V) {
                    y++;
                } else if(W===0 && V>=52) {
                    y--;
                }
    
                return y;
            },
        H: ['getHours', '0'],
        I: function (d) { var I=d.getHours()%12; return xPad(I===0?12:I, 0); },
        j: function (d) {
                var gmd_1 = new Date('' + d.getFullYear() + '/1/1 GMT');
                var gmdate = new Date('' + d.getFullYear() + '/' + (d.getMonth()+1) + '/' + d.getDate() + ' GMT');
                var ms = gmdate - gmd_1;
                var doy = parseInt(ms/60000/60/24, 10)+1;
                return xPad(doy, 0, 100);
            },
        k: ['getHours', ' '],
        l: function (d) { var I=d.getHours()%12; return xPad(I===0?12:I, ' '); },
        m: function (d) { return xPad(d.getMonth()+1, 0); },
        M: ['getMinutes', '0'],
        p: function (d, l) { return l.p[d.getHours() >= 12 ? 1 : 0 ]; },
        P: function (d, l) { return l.P[d.getHours() >= 12 ? 1 : 0 ]; },
        s: function (d, l) { return parseInt(d.getTime()/1000, 10); },
        S: ['getSeconds', '0'],
        u: function (d) { var dow = d.getDay(); return dow===0?7:dow; },
        U: function (d) {
                var doy = parseInt(Dt.formats.j(d), 10);
                var rdow = 6-d.getDay();
                var woy = parseInt((doy+rdow)/7, 10);
                return xPad(woy, 0);
            },
        V: function (d) {
                var woy = parseInt(Dt.formats.W(d), 10);
                var dow1_1 = (new Date('' + d.getFullYear() + '/1/1')).getDay();
                // First week is 01 and not 00 as in the case of %U and %W,
                // so we add 1 to the final result except if day 1 of the year
                // is a Monday (then %W returns 01).
                // We also need to subtract 1 if the day 1 of the year is 
                // Friday-Sunday, so the resulting equation becomes:
                var idow = woy + (dow1_1 > 4 || dow1_1 <= 1 ? 0 : 1);
                if(idow === 53 && (new Date('' + d.getFullYear() + '/12/31')).getDay() < 4)
                {
                    idow = 1;
                }
                else if(idow === 0)
                {
                    idow = Dt.formats.V(new Date('' + (d.getFullYear()-1) + '/12/31'));
                }
    
                return xPad(idow, 0);
            },
        w: 'getDay',
        W: function (d) {
                var doy = parseInt(Dt.formats.j(d), 10);
                var rdow = 7-Dt.formats.u(d);
                var woy = parseInt((doy+rdow)/7, 10);
                return xPad(woy, 0, 10);
            },
        y: function (d) { return xPad(d.getFullYear()%100, 0); },
        Y: 'getFullYear',
        z: function (d) {
                var o = d.getTimezoneOffset();
                var H = xPad(parseInt(Math.abs(o/60), 10), 0);
                var M = xPad(Math.abs(o%60), 0);
                return (o>0?'-':'+') + H + M;
            },
        Z: function (d) {
		var tz = d.toString().replace(/^.*:\d\d( GMT[+-]\d+)? \(?([A-Za-z ]+)\)?\d*$/, '$2').replace(/[a-z ]/g, '');
		if(tz.length > 4) {
			tz = Dt.formats.z(d);
		}
		return tz;
	},
        '%': function (d) { return '%'; }
    },

    aggregates: {
        c: 'locale',
        D: '%m/%d/%y',
        F: '%Y-%m-%d',
        h: '%b',
        n: '\n',
        r: 'locale',
        R: '%H:%M',
        t: '\t',
        T: '%H:%M:%S',
        x: 'locale',
        X: 'locale'
        //'+': '%a %b %e %T %Z %Y'
    },

     /**
     * Takes a native JavaScript Date and formats it as a string for display to user.
     *
     * @method format
     * @param oDate {Date} Date.
     * @param oConfig {Object} (Optional) Object literal of configuration values:
     *  <dl>
     *   <dt>format &lt;String&gt;</dt>
     *   <dd>
     *   <p>
     *   Any strftime string is supported, such as "%I:%M:%S %p". strftime has several format specifiers defined by the Open group at 
     *   <a href="http://www.opengroup.org/onlinepubs/007908799/xsh/strftime.html">http://www.opengroup.org/onlinepubs/007908799/xsh/strftime.html</a>
     *   PHP added a few of its own, defined at <a href="http://www.php.net/strftime">http://www.php.net/strftime</a>
     *   </p>
     *   <p>
     *   This javascript implementation supports all the PHP specifiers and a few more.  The full list is below.
     *   </p>
     *   <p>
     *   If not specified, it defaults to the ISO8601 standard date format: %Y-%m-%d
     *   </p>
     *   <dl>
     *    <dt>%a</dt> <dd>abbreviated weekday name according to the current locale</dd>
     *    <dt>%A</dt> <dd>full weekday name according to the current locale</dd>
     *    <dt>%b</dt> <dd>abbreviated month name according to the current locale</dd>
     *    <dt>%B</dt> <dd>full month name according to the current locale</dd>
     *    <dt>%c</dt> <dd>preferred date and time representation for the current locale</dd>
     *    <dt>%C</dt> <dd>century number (the year divided by 100 and truncated to an integer, range 00 to 99)</dd>
     *    <dt>%d</dt> <dd>day of the month as a decimal number (range 01 to 31)</dd>
     *    <dt>%D</dt> <dd>same as %m/%d/%y</dd>
     *    <dt>%e</dt> <dd>day of the month as a decimal number, a single digit is preceded by a space (range ' 1' to '31')</dd>
     *    <dt>%F</dt> <dd>same as %Y-%m-%d (ISO 8601 date format)</dd>
     *    <dt>%g</dt> <dd>like %G, but without the century</dd>
     *    <dt>%G</dt> <dd>The 4-digit year corresponding to the ISO week number</dd>
     *    <dt>%h</dt> <dd>same as %b</dd>
     *    <dt>%H</dt> <dd>hour as a decimal number using a 24-hour clock (range 00 to 23)</dd>
     *    <dt>%I</dt> <dd>hour as a decimal number using a 12-hour clock (range 01 to 12)</dd>
     *    <dt>%j</dt> <dd>day of the year as a decimal number (range 001 to 366)</dd>
     *    <dt>%k</dt> <dd>hour as a decimal number using a 24-hour clock (range 0 to 23); single digits are preceded by a blank. (See also %H.)</dd>
     *    <dt>%l</dt> <dd>hour as a decimal number using a 12-hour clock (range 1 to 12); single digits are preceded by a blank. (See also %I.) </dd>
     *    <dt>%m</dt> <dd>month as a decimal number (range 01 to 12)</dd>
     *    <dt>%M</dt> <dd>minute as a decimal number</dd>
     *    <dt>%n</dt> <dd>newline character</dd>
     *    <dt>%p</dt> <dd>either `AM' or `PM' according to the given time value, or the corresponding strings for the current locale</dd>
     *    <dt>%P</dt> <dd>like %p, but lower case</dd>
     *    <dt>%r</dt> <dd>time in a.m. and p.m. notation equal to %I:%M:%S %p</dd>
     *    <dt>%R</dt> <dd>time in 24 hour notation equal to %H:%M</dd>
     *    <dt>%s</dt> <dd>number of seconds since the Epoch, ie, since 1970-01-01 00:00:00 UTC</dd>
     *    <dt>%S</dt> <dd>second as a decimal number</dd>
     *    <dt>%t</dt> <dd>tab character</dd>
     *    <dt>%T</dt> <dd>current time, equal to %H:%M:%S</dd>
     *    <dt>%u</dt> <dd>weekday as a decimal number [1,7], with 1 representing Monday</dd>
     *    <dt>%U</dt> <dd>week number of the current year as a decimal number, starting with the
     *            first Sunday as the first day of the first week</dd>
     *    <dt>%V</dt> <dd>The ISO 8601:1988 week number of the current year as a decimal number,
     *            range 01 to 53, where week 1 is the first week that has at least 4 days
     *            in the current year, and with Monday as the first day of the week.</dd>
     *    <dt>%w</dt> <dd>day of the week as a decimal, Sunday being 0</dd>
     *    <dt>%W</dt> <dd>week number of the current year as a decimal number, starting with the
     *            first Monday as the first day of the first week</dd>
     *    <dt>%x</dt> <dd>preferred date representation for the current locale without the time</dd>
     *    <dt>%X</dt> <dd>preferred time representation for the current locale without the date</dd>
     *    <dt>%y</dt> <dd>year as a decimal number without a century (range 00 to 99)</dd>
     *    <dt>%Y</dt> <dd>year as a decimal number including the century</dd>
     *    <dt>%z</dt> <dd>numerical time zone representation</dd>
     *    <dt>%Z</dt> <dd>time zone name or abbreviation</dd>
     *    <dt>%%</dt> <dd>a literal `%' character</dd>
     *   </dl>
     *  </dd>
     * </dl>
     * @param sLocale {String} (Optional) The locale to use when displaying days of week,
     *  months of the year, and other locale specific strings.  The following locales are
     *  built in:
     *  <dl>
     *   <dt>en</dt>
     *   <dd>English</dd>
     *   <dt>en-US</dt>
     *   <dd>US English</dd>
     *   <dt>en-GB</dt>
     *   <dd>British English</dd>
     *   <dt>en-AU</dt>
     *   <dd>Australian English (identical to British English)</dd>
     *  </dl>
     *  More locales may be added by subclassing of Y.DataType.Date.Locale.
     *  See Y.DataType.Date.Locale for more information.
     * @return {String} Formatted date for display.
     * @sa Y.DataType.Date.Locale
     */
    format : function (oDate, oConfig, sLocale) {
        oConfig = oConfig || {};
        
        if(!(oDate instanceof Date)) {
            return YAHOO.lang.isValue(oDate) ? oDate : "";
        }

        var format = oConfig.format || "%Y-%m-%d";

        sLocale = sLocale || "en";

        // Make sure we have a definition for the requested locale, or default to en.
        if(!(sLocale in Y.DataType.Date.Locale)) {
            if(sLocale.replace(/-[a-zA-Z]+$/, '') in Y.DataType.Date.Locale) {
                sLocale = sLocale.replace(/-[a-zA-Z]+$/, '');
            } else {
                sLocale = "en";
            }
        }

        var aLocale = Y.DataType.Date.Locale[sLocale];

        var replace_aggs = function (m0, m1) {
            var f = Dt.aggregates[m1];
            return (f === 'locale' ? aLocale[m1] : f);
        };

        var replace_formats = function (m0, m1) {
            var f = Dt.formats[m1];
            if(typeof f === 'string') {             // string => built in date function
                return oDate[f]();
            } else if(typeof f === 'function') {    // function => our own function
                return f.call(oDate, oDate, aLocale);
            } else if(typeof f === 'object' && typeof f[0] === 'string') {  // built in function with padding
                return xPad(oDate[f[0]](), f[1]);
            } else {
                return m1;
            }
        };

        // First replace aggregates (run in a loop because an agg may be made up of other aggs)
        while(format.match(/%[cDFhnrRtTxX]/)) {
            format = format.replace(/%([cDFhnrRtTxX])/g, replace_aggs);
        }

        // Now replace formats (do not run in a loop otherwise %%a will be replace with the value of %a)
        var str = format.replace(/%([aAbBCdegGHIjklmMpPsSuUVwWyYzZ%])/g, replace_formats);

        replace_aggs = replace_formats = undefined;

        return str;
    }
};

Y.namespace("DataType");
Y.DataType.Date = Dt;

})();
