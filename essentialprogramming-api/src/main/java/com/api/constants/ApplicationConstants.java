package com.api.constants;

import com.util.io.FileUtils;

import java.io.File;

public class ApplicationConstants {
    public static final String PATH = FileUtils.getResourceBasePath() + File.separator +  "video";

    public static final String CONTENT_TYPE = "Content-Type";
    public static final String CONTENT_LENGTH = "Content-Length";
    public static final String VIDEO_CONTENT = "video/";
    public static final String CONTENT_RANGE = "Content-Range";
    public static final String ACCEPT_RANGES = "Accept-Ranges";
    public static final String BYTES = "bytes";
    public static final int SEGMENT = 1000000;
    public static final byte[] SHORT_BYTE = new byte[1];

    private ApplicationConstants() {
    }
}
