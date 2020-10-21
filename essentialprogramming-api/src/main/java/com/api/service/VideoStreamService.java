package com.api.service;

import com.util.io.FileInputResource;
import lombok.SneakyThrows;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.ws.rs.core.Response;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

import static com.api.constants.ApplicationConstants.*;

@Service
public class VideoStreamService {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    /**
     * Prepare the content.
     *
     * @param fileName String.
     * @param fileType String.
     * @param range    String.
     * @return ResponseEntity.
     */
    public Response prepareContent(String fileName, String fileType, String range) {
        long rangeStart = 0;
        long rangeEnd;
        byte[] data;
        Long fileSize;
        String fullFileName = fileName + "." + fileType;
        try {
            fileSize = getFileSize(fullFileName);
            if (range == null) {
                return Response.ok(readByteRange(fullFileName, rangeStart, fileSize - 1))
                        .status(Response.Status.OK)
                        .header(CONTENT_TYPE, VIDEO_CONTENT + fileType)
                        .header(CONTENT_LENGTH, String.valueOf(fileSize))
                        .build();
                         // Read the object and convert it as bytes
            }
            String[] ranges = range.split("-");
            rangeStart = Long.parseLong(ranges[0].substring(6));
            if (ranges.length > 1) {
                rangeEnd = Long.parseLong(ranges[1]);
            } else {
                rangeEnd = fileSize - 1;
            }
            if (fileSize < rangeEnd) {
                rangeEnd = fileSize - 1;
            }
            data = readByteRange(fullFileName, rangeStart, rangeEnd);
        } catch (IOException e) {
            logger.error("Exception while reading the file {}", e.getMessage());
            return Response.serverError().status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
        String contentLength = String.valueOf((rangeEnd - rangeStart) + 1);
        return Response.ok(data)
                .status(Response.Status.PARTIAL_CONTENT)
                .header(CONTENT_TYPE, VIDEO_CONTENT + fileType)
                .header(ACCEPT_RANGES, BYTES)
                .header(CONTENT_LENGTH, contentLength)
                .header(CONTENT_RANGE, BYTES + " " + rangeStart + "-" + rangeEnd + "/" + fileSize)
                .build();


    }

    /**
     * ready file byte by byte.
     *
     * @param fileName String.
     * @param start    long.
     * @param end      long.
     * @return byte array.
     * @throws IOException exception.
     */
    public byte[] readByteRange(String fileName, long start, long end) throws IOException {
        FileInputResource fileInputResource = new FileInputResource(VIDEO + "/" + fileName);
        try (InputStream inputStream = (fileInputResource.getInputStream());
             ByteArrayOutputStream bufferedOutputStream = new ByteArrayOutputStream()) {
            byte[] data = new byte[BYTE_RANGE];
            int nRead;
            while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
                bufferedOutputStream.write(data, 0, nRead);
            }
            bufferedOutputStream.flush();
            byte[] result = new byte[(int) (end - start) + 1];
            System.arraycopy(bufferedOutputStream.toByteArray(), (int) start, result, 0, result.length);
            return result;
        }
    }

    /**
     * Get the filePath.
     *
     * @return String.
     */
    @SneakyThrows
    private String getFilePath(String fileName) {

        FileInputResource fileInputResource = new FileInputResource(VIDEO + "/" + fileName);
        URL url = fileInputResource.getFile();
        return new File(url.getFile()).getAbsolutePath();
    }

    @SneakyThrows
    private URL getFile(String fileName) {

        FileInputResource fileInputResource = new FileInputResource(VIDEO + "/" + fileName);
        URL url = fileInputResource.getFile();
        return url;
    }

    /**
     * Content length.
     *
     * @param fileName String.
     * @return Long.
     */
    public Long getFileSize(String fileName) {
        return Optional.ofNullable(fileName)
                .map(file -> getFile(fileName))
                .map(this::getFileSize)
                .orElse(0L);
    }

    @SneakyThrows
    public long getFileSize(URL url) {
        try (InputStream stream = url.openStream()) {
            return stream.available();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Getting the size from the path.
     *
     * @param path Path.
     * @return Long.
     */
    private Long sizeFromFile(Path path) {
        try {
            return Files.size(path);
        } catch (IOException ioException) {
            logger.error("Error while getting the file size", ioException);
        }
        return 0L;
    }
}