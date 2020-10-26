package com.api.controller.handler;

import com.api.service.VideoStreamService;

import com.util.exceptions.ValidationException;
import com.util.handler.BiHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.core.Response;


@Component
public class StreamRequestValidationHandler implements BiHandler<String, String> {

    private final VideoStreamService videoStreamService;

    @Autowired
    public StreamRequestValidationHandler(VideoStreamService videoStreamService) {
        this.videoStreamService = videoStreamService;
    }

    @Override
    public void handle(String range, String fileName) {

        // proceed validation
        validateRange(range, fileName);

    }


    /**
     * Validate range header format
     *
     * @param range    String
     * @param fileName String
     */
    private void validateRange(String range, String fileName) {
        // Range header should match format "bytes=n-n,n-n,n-n...". If not, then return 416.
        if (!range.matches("^bytes=\\d*-\\d*(,\\d*-\\d*)*$")) {
            throw new ValidationException("bytes */" + videoStreamService.getFileSize(fileName), Response.Status.REQUESTED_RANGE_NOT_SATISFIABLE);
        }
    }
}
