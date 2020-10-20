package com.util.io;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;


public class FileInputResource implements InputResource {

    private final URL file;

    public FileInputResource(String fileName) throws IOException {
        file = InputResource.getURL(fileName);
    }

    @Override
    public InputStream getInputStream()
            throws IOException {
        return new BufferedInputStream(file.openStream());
    }

    public byte[] getBytes() throws IOException {
        final InputStream inputStream = getInputStream();
        final ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        int nRead;
        byte[] data = new byte[1024];
        while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
            buffer.write(data, 0, nRead);
        }

        buffer.flush();
        return buffer.toByteArray();
    }

    public URL getFile() {
        return file;
    }
}
