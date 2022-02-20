package com.util.io;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

public class FileInputResource implements InputResource, AutoCloseable {

    private static final int BYTE_RANGE = 1024;

    private final URL file;
    private final InputStream inputStream;

    public FileInputResource(String fileName) throws IOException {
        file = InputResource.getURL(fileName);
        inputStream = new BufferedInputStream(file.openStream());
    }

    @Override
    public InputStream getInputStream() {
        return inputStream;
    }

    public URL getFile() {
        return file;
    }

    public byte[] getBytes() throws IOException {
        try (final InputStream inputStream = getInputStream()) {
            return readStream(inputStream);
        }
    }

    /**
     * Converts an input stream into a byte array.
     */
    public static byte[] readStream(final InputStream inputStream) throws IOException {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            final byte[] buffer = new byte[BYTE_RANGE];
            int nRead;
            while ((nRead = inputStream.read(buffer, 0, buffer.length)) != -1) {
                outputStream.write(buffer, 0, nRead);
            }
            outputStream.flush();
            return outputStream.toByteArray();
        }
    }

    public byte[] getBytes(long start, int length) throws IOException {
        try (final InputStream inputStream = getInputStream()) {
            return readStream(inputStream, start, length);
        }
    }

    public static byte[] readStream(final InputStream inputStream, final long start, final int length) throws IOException {
        try (ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {
            inputStream.skip(start);
            long toRead = length;
            int nRead;
            byte[] data = new byte[BYTE_RANGE];
            while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
                if ((toRead -= nRead) > 0) {
                    buffer.write(data, 0, nRead);
                    buffer.flush();
                } else {
                    buffer.write(data, 0, (int) toRead + nRead);
                    buffer.flush();
                    break;
                }
            }
            return buffer.toByteArray();
        }
    }



    @Override
    public void close() throws IOException {
        if (inputStream != null) {
            inputStream.close();
        }

    }
}
