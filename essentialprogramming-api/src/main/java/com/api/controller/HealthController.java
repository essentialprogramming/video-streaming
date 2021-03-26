package com.api.controller;

import com.api.config.Anonymous;
import com.util.io.FileUtils;
import com.web.json.JsonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/status/v1/health/")
public class HealthController {

    @Operation(summary = "Liveness check endpoint", tags = {"Liveness",}, operationId = "liveness",
            description = "Liveness endpoint , part of API health check service.",
            responses = {@ApiResponse(responseCode = "200", description = "Api is live.",
                    content = @Content(mediaType = "application/text",
                            schema = @Schema(implementation = String.class))),
                    @ApiResponse(responseCode = "404", description = "Resource not available.")})
    @GET
    @Path("liveness")
    @Anonymous
    public Response getLiveness() {
        return Response.ok().entity("\n\nI'm alive!\n\n").build();
    }


    @Operation(summary = "Readiness check endpoint", tags = {"Readiness",}, operationId = "readiness",
            description = "Readiness endpoint , part of API health check service.",
            responses = {@ApiResponse(responseCode = "200", description = "Api is ready.",
                    content = @Content(mediaType = "application/text",
                            schema = @Schema(implementation = String.class))),
                    @ApiResponse(responseCode = "404", description = "Resource not available.")})
    @GET
    @Path("readiness")
    @Anonymous
    public Response getReadiness() {
        return Response.ok("\n\nI'm ready to work!\n\n").build();
    }


    @GET
    @Path("path")
    @Produces(MediaType.APPLICATION_JSON)
    @Anonymous
    public JsonResponse getResourceBasePath() {
        try {
            return new  JsonResponse().with("FileUtils.getResource : ",FileUtils.getResourceBasePath()).done();
        }
        catch (Exception exception) {
            return new JsonResponse().with("stackTrace", exception.getStackTrace())
                    .with("cause",exception.getCause())
                    .with("message",exception.getMessage())
                    .with("localizedMessage",exception.getLocalizedMessage()).done();
        }
    }

}
