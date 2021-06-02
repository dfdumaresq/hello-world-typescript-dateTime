import moment from "moment";

/**
 * Decode JWT
 */
export const jwtDecode = (token: string | null): {} => {
    if (token) {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        return JSON.parse(window.atob(base64));
    }

    return {};
};

/**
 * Get a cookie value by cname
 */
export const getCookie = (name: string): string => {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    const cookie = parts.length === 2 && parts.pop().split(";").shift();
    return cookie;
};

/**
 * Make number have commas
 */
export const numberWithCommas = (x: number, decimals = 0): string => {
    return x.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Frequently-used Moment JS date formats
 */
export const dateFormats = {
    short: "YYYY-MM-DD HH:mm",
    shortDate: "YYYY-MM-DD",
    medium: "Y MMM D, h:mm a",
    mediumDate: "Y MMM D",
    long: "MMMM D, YYYY [at] h:mm a",
    longDate: "MMMM D, YYYY",
    rfc3339: "YYYY-MM-DDTHH:mm:ss[Z]",
};

/**
 * Parse valid date string to RFC-3339 date
 * return formatted date or initial value
 * - date validation should be used prior to submission
 */
export const parseToDate = (value: string): string => {
    const inputMoment = String(value).includes("at") ? moment.utc(value, dateFormats.long, true) : moment.utc(value);

    return (value && inputMoment.isValid()) ? inputMoment.format(dateFormats.rfc3339) : value;
};

/**
 * Format date with provided format
 * - accept `0001-01-01T00:00:00` as `null`
 */
export const formatDate = (value: string, format: string): string => (
    value && value !== "0001-01-01T00:00:00" ? moment(value).format(format) : null
);

/**
 * Return a partial object with only the differences between two objects of the same type
 */
export const objectDifference = <T extends {}>(original: T, compare: T): Partial<T> => {
    const retVal = {};
    Object.keys(compare).forEach(k => {
        if (typeof compare[k] !== "object" && compare[k] != original[k]) { // loose comaprison, original might be number and compare might be string
            retVal[k] = compare[k];
        } else if (typeof compare[k] === "object" && compare[k]) {
            retVal[k] = objectDifference(original[k], compare[k]);
            // if object is empty, remove it from the return value
            if (Object.keys(retVal[k]).length === 0 && retVal[k].constructor === Object) delete retVal[k];
        }
    });
    return retVal;
};

/**
 * Asynchronously fetch provided endpoint
 * Return successful result or optionally-provided default value
 * * This is intended specifically for Redux-Form async validation,
 *   Redux actions and reducers should primarily be used for data management
 */
export const apiFetch = async <T>(endpoint: string, defaultValue?: Partial<T>): Promise<Partial<T>> => {
    const response = await fetch(endpoint);
    const data = response.ok ? await response.json() as T : defaultValue;

    return data;
};

/**
 * Create an array of days (Dates), given start and end dates
 * Used by DateRangeField to set disabled dates from provided date ranges
 */
export const getDatesArray = (start: Date, end: Date): Date[] => {
    const dates = [];

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)){
        dates.push(new Date(date));
    }

    return dates;
};
