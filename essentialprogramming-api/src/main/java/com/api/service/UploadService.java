package com.api.service;

import com.api.constants.ApplicationConstants;
import com.util.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

@Service
public class UploadService {

    String FILE_PATH;

    @Autowired
    public UploadService() {
        String uploadFolder = ApplicationConstants.PATH;
        FILE_PATH = uploadFolder + File.separator;
    }

    @Transactional
    public void upload(InputStream uploadedInputStream, FormDataContentDisposition fileDetails) {
        String uploadedFileLocation = FILE_PATH + fileDetails.getFileName();
        writeToFile(uploadedInputStream, uploadedFileLocation);
    }


    private void writeToFile(InputStream uploadedInputStream, String targetFileName) {
        try {
            Path targetFile = FileUtils.getPath(targetFileName, true);
            Files.copy(uploadedInputStream, targetFile, StandardCopyOption.REPLACE_EXISTING);

            IOUtils.closeQuietly(uploadedInputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
