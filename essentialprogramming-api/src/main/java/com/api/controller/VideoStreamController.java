package com.api.controller;

import com.api.config.Anonymous;
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

import static com.api.constants.ApplicationConstants.CONTENT_TYPE;
import static com.api.constants.ApplicationConstants.VIDEO_CONTENT;

@Path("/video/")
public class VideoStreamController {

    private static final Logger LOGGER = LoggerFactory.getLogger(VideoStreamController.class);

    private final VideoStreamService videoStreamService;

    @Context
    private Language language;

    @Autowired
    public VideoStreamController(VideoStreamService videoStreamService) {
        this.videoStreamService = videoStreamService;
    }

    @GET
    @Path("stream/{fileType}/{fileName}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    @Operation(summary = "Stream video", tags = {"Video",})
    @Anonymous
    public void streamVideo(@PathParam("fileType") String fileType,
                            @PathParam("fileName") String fileName,
                            @HeaderParam(value = "Range") String httpRangeList,
                            @Suspended AsyncResponse asyncResponse) {

        ExecutorService executorService = ExecutorsProvider.getExecutorService();
        System.out.println(httpRangeList);
        Computation.computeAsync(() -> stream(fileType, fileName, httpRangeList), executorService)
                .thenApplyAsync(asyncResponse::resume, executorService)
                .exceptionally(error -> asyncResponse.resume(ExceptionHandler.handleException((CompletionException) error)));

    }

    private Response stream(String fileType, String fileName, String httpRangeList) {
        if (httpRangeList == null) {
            return Response.ok(new byte[1])
                    .status(Response.Status.OK)
                    .header(CONTENT_TYPE, VIDEO_CONTENT + fileType)
                    .build();
        }
        return videoStreamService.prepareContent(fileName, fileType, httpRangeList);
    }
}
