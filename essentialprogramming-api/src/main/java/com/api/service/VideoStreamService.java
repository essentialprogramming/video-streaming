package com.api.service;

import com.exception.ErrorCode;
import com.util.exceptions.ServiceException;
import com.util.io.FileInputResource;
import lombok.SneakyThrows;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

import static com.api.constants.ApplicationConstants.*;

@Service
public class VideoStreamService {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    /**
     * Prepare the content.
     *
     * @param fileName String.
     * @param rangeStart Long.
     * @param rangeEnd    Long.
     * @return ResponseEntity.
     */
    public byte[] prepareContent(String fileName, long rangeStart, long rangeEnd) {
      try{
            return readByteRange(fileName, rangeStart, rangeEnd);
        } catch (IOException e) {
            logger.error("Exception while reading the file {}", e.getMessage());
            throw new ServiceException(ErrorCode.ERROR_READING_FILE);
        }

    }

    /**
     * Read file.
     *
     * @param fileName String.
     * @param start    long.
     * @param end      long.
     * @return byte array.
     * @throws IOException exception.
     */
    public byte[] readByteRange(String fileName, long start, long end) throws IOException {
        FileInputResource fileInputResource = new FileInputResource(PATH + "/" + fileName);

        //byte[] result = new byte[(int) (end - start) + 1];
        //System.arraycopy(fileInputResource.getBytes(), (int) start, result, 0, result.length);

        return fileInputResource.getBytes(start, (int) (end - start) + 1);

    }

    /**
     * Get the filePath.
     *
     * @return String.
     */
    @SneakyThrows
    private String getFilePath(String fileName) {

        FileInputResource fileInputResource = new FileInputResource(PATH + "/" + fileName);
        URL url = fileInputResource.getFile();
        return new File(url.getFile()).getAbsolutePath();
    }

    @SneakyThrows
    private URL getFile(String fileName) {

        FileInputResource fileInputResource = new FileInputResource(PATH + "/" + fileName);
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