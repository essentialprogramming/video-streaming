package com.api.controller;

import com.api.config.Anonymous;
import com.api.controller.handler.StreamRequestValidationHandler;
import com.api.service.VideoStreamService;
import com.config.ExecutorsProvider;
import com.exception.ExceptionHandler;
import com.util.async.Computation;
import com.util.enums.Language;
import io.swagger.v3.oas.annotations.Operation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.*;
import javax.ws.rs.container.AsyncResponse;
import javax.ws.rs.container.Suspended;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.concurrent.CompletionException;
import java.util.concurrent.ExecutorService;

import static com.api.constants.ApplicationConstants.*;

@Path("/video/")
public class VideoStreamController {

    private static final Logger logger = LoggerFactory.getLogger(VideoStreamController.class);
    private final VideoStreamService videoStreamService;
    private final StreamRequestValidationHandler streamRequestValidationHandler;

    @Context
    private Language language;

    @Autowired
    public VideoStreamController(VideoStreamService videoStreamService, StreamRequestValidationHandler streamRequestValidationHandler) {
        this.videoStreamService = videoStreamService;
        this.streamRequestValidationHandler = streamRequestValidationHandler;
    }

    @GET
    @Path("stream/{fileType}/{fileName}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    @Operation(summary = "Stream video", tags = {"Video",})
    @Anonymous
    public void streamVideo(@PathParam("fileType") String fileType,
                            @PathParam("fileName") String fileName,
                            @HeaderParam(value = "Range") String range,
                            @Suspended AsyncResponse asyncResponse) {

        logger.info(range);

        ExecutorService executorService = ExecutorsProvider.getExecutorService();
        Computation.computeAsync(() -> stream(fileType, fileName, range), executorService)
                .thenApplyAsync(asyncResponse::resume, executorService)
                .exceptionally(error -> asyncResponse.resume(ExceptionHandler.handleException((CompletionException) error)));

    }

    private Response stream(String fileType, String fileName, String range) {
        if (range == null) {
            return Response.ok(SHORT_BYTE)
                    .status(Response.Status.OK)
                    .header(CONTENT_TYPE, VIDEO_CONTENT + fileType)
                    .build();
        }

        streamRequestValidationHandler.handle(range, fileName + "." + fileType);

        long rangeStart = 0;
        long rangeEnd;

        final String fullFileName = fileName + "." + fileType;


        String[] ranges = range.split("-");
        rangeStart = Long.parseLong(ranges[0].substring(6));
        if (ranges.length > 1) {
            rangeEnd = Long.parseLong(ranges[1]);
        } else {
            rangeEnd = rangeStart + SEGMENT;
        }
        final Long fileSize = videoStreamService.getFileSize(fullFileName);
        if (fileSize < rangeEnd) {
            rangeEnd = fileSize - 1;
        }

        final byte[] data = videoStreamService.prepareContent(fullFileName, rangeStart, rangeEnd);
        final String contentLength = String.valueOf((rangeEnd - rangeStart) + 1);
        return Response.ok(data)
                .status(Response.Status.PARTIAL_CONTENT) // 206.
                .header(CONTENT_TYPE, VIDEO_CONTENT + fileType)
                .header(ACCEPT_RANGES, BYTES)
                .header(CONTENT_LENGTH, contentLength)
                .header(CONTENT_RANGE, BYTES + " " + rangeStart + "-" + rangeEnd + "/" + fileSize)
                .build();

    }
}
