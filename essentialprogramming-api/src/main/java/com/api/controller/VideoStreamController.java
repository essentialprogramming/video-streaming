package com.api.controller;

import com.api.config.Anonymous;
import com.api.controller.handler.StreamRequestValidationHandler;
import com.api.disruptor.IncomingStreamRequestDisruptor;
import com.api.events.StreamRequestTranslator;
import com.api.validation.Validators;
import com.config.ExecutorsProvider;
import com.exception.ExceptionHandler;
import com.util.async.Computation;
import com.util.enums.Language;
import io.swagger.v3.oas.annotations.Operation;
import lombok.SneakyThrows;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.AsyncContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
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
    private final StreamRequestValidationHandler streamRequestValidationHandler;
    private final IncomingStreamRequestDisruptor incomingStreamRequestDisruptor;

    @Context
    private Language language;
    @Context
    private HttpServletRequest request;
    @Context
    private HttpServletResponse response;

    @Autowired
    public VideoStreamController(StreamRequestValidationHandler streamRequestValidationHandler, IncomingStreamRequestDisruptor incomingStreamRequestDisruptor) {
        this.streamRequestValidationHandler = streamRequestValidationHandler;
        this.incomingStreamRequestDisruptor = incomingStreamRequestDisruptor;
    }

    @GET
    @Path("stream/{fileType}/{fileName}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    @Operation(summary = "Stream video", tags = {"Video",})
    @Anonymous
    public void streamVideo(@PathParam("fileType") String fileType,
                            @PathParam("fileName") String fileName,
                            @HeaderParam(value = "Range") /*@Valid @Validators.CheckRange(required = false)*/ String range,
                            @Suspended AsyncResponse asyncResponse) {

        logger.info(range);

        assert request.isAsyncStarted();
        final AsyncContext asyncContext = request.getAsyncContext();

        ExecutorService executorService = ExecutorsProvider.getExecutorService();
        Computation.runAsync(() -> streamVideo(fileType, fileName, range, asyncResponse, asyncContext), executorService)
                .thenApply(____ -> true)
                .exceptionally(error -> asyncResponse.resume(ExceptionHandler.handleException((CompletionException) error)));

    }

    @SneakyThrows
    private void streamVideo(String fileType, String fileName, String byteRange,
                             AsyncResponse asyncResponse,
                             AsyncContext asyncContext) {
        if (byteRange == null) {
            asyncResponse.resume(
                    Response.ok(SHORT_BYTE)
                            .status(Response.Status.OK)
                            .header(CONTENT_TYPE, VIDEO_CONTENT + fileType)
                            .build());
            return;
        }
        stream(fileType, fileName, byteRange, asyncContext);


    }

    private void stream(String fileType, String fileName,
                        String byteRange, AsyncContext asyncContext) {

        //range validation
        final String fullFileName = fileName + "." + fileType;
        streamRequestValidationHandler.handle(byteRange, fullFileName);

        final StreamRequestTranslator streamRequestTranslator = new StreamRequestTranslator(asyncContext, fileName, fileType, byteRange);
        incomingStreamRequestDisruptor.getDisruptor().publishEvent(streamRequestTranslator);

    }
}
