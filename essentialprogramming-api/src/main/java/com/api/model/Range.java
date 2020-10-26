package com.api.model;

import static com.api.constants.ApplicationConstants.SEGMENT;

public class Range {

    public final long start;
    public final long end;
    public final long length;
    public final long total;

    /**
     * Construct a byte range.
     * @param start Start of the byte range.
     * @param end End of the byte range.
     * @param total Total length of the byte source.
     */
    public Range(long start, long end, long total) {
        this.start = start;
        this.end = end;
        this.length = end - start + 1;
        this.total = total;
    }

    public static Range of(String range, long total){
        String[] ranges = range.split("-");
        long rangeStart;
        long rangeEnd;
        rangeStart = Long.parseLong(ranges[0].substring(6));
        if (ranges.length > 1) {
            rangeEnd = Long.parseLong(ranges[1]);
        } else {
            rangeEnd = rangeStart + SEGMENT - 1;
        }
        if (total < rangeEnd) {
            rangeEnd = total - 1;
        }
        return new Range(rangeStart, rangeEnd, total);
    }


}
