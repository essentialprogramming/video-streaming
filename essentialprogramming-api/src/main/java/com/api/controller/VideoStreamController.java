package com.api.controller;

import com.api.config.Anonymous;
import com.api.controller.handler.StreamRequestValidationHandler;
import com.api.model.Range;
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

    private Response stream(String fileType, String fileName, String byteRange) {
        if (byteRange == null) {
            return Response.ok(SHORT_BYTE)
                    .status(Response.Status.OK)
                    .header(CONTENT_TYPE, VIDEO_CONTENT + fileType)
                    .build();
        }
        final String fullFileName = fileName + "." + fileType;

        //range validation
        streamRequestValidationHandler.handle(byteRange, fullFileName);

        final Range range = Range.of(byteRange, videoStreamService.getFileSize(fullFileName));


        final byte[] data = videoStreamService.prepareContent(fullFileName, range.start, range.end);
        final String contentLength = String.valueOf(range.length);
        return Response.ok(data)
                .status(Response.Status.PARTIAL_CONTENT) // 206.
                .header(CONTENT_TYPE, VIDEO_CONTENT + fileType)
                .header(ACCEPT_RANGES, BYTES)
                .header(CONTENT_LENGTH, contentLength)
                .header(CONTENT_RANGE, BYTES + " " + range.start + "-" + range.end + "/" + range.total)
                .build();

    }
}
