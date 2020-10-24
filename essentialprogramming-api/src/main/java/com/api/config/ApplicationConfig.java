package com.api.config;


import com.api.controller.*;
import com.fasterxml.jackson.jaxrs.json.JacksonJaxbJsonProvider;
import io.swagger.v3.jaxrs2.integration.resources.AcceptHeaderOpenApiResource;
import io.swagger.v3.oas.integration.SwaggerConfiguration;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.process.internal.RequestScoped;
import org.glassfish.jersey.server.ResourceConfig;

import javax.ws.rs.ApplicationPath;
import java.util.Collections;

/**
 * JAX-RS application configuration class.
 */

@ApplicationPath("/api")

public class ApplicationConfig extends ResourceConfig {

    public ApplicationConfig() {

        register(CorsFilter.class);
        register(JacksonJaxbJsonProvider.class);
        register(VideoStreamController.class);
        register(MultiPartFeature.class);


        OpenAPI openAPI = new OpenAPI()
                .components(new Components())
                .info(new Info()
                        .title("Video Streaming API")
                        .description(
                                "Video Streaming endpoints using OpenAPI 3.0")
                        .version("v1")
                )
                .schemaRequirement("Bearer", new SecurityScheme()
                        .name("Authorization")
                        .description("JWT Authorization header using the Bearer scheme. Example: \\\\\\\"Authorization: Bearer {token}\\\\\\\"")
                        .type(SecurityScheme.Type.APIKEY)
                        .in(SecurityScheme.In.HEADER)
                )
                .security(Collections.singletonList(new SecurityRequirement().addList("Bearer")));

        SwaggerConfiguration oasConfig = new SwaggerConfiguration()
                .openAPI(openAPI)
                .prettyPrint(true);

        AcceptHeaderOpenApiResource openApiResource = new AcceptHeaderOpenApiResource();
        openApiResource.setOpenApiConfiguration(oasConfig);
        register(openApiResource);
    }

}
