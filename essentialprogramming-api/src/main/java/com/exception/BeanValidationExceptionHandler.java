package com.exception;

import com.web.json.JsonResponse;

import javax.annotation.Priority;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import java.util.Set;

@Provider
@Priority(1)
public class BeanValidationExceptionHandler implements ExceptionMapper<ConstraintViolationException> {
    @Override
    public Response toResponse(ConstraintViolationException e) {
        Set<ConstraintViolation<?>> constraintValidations = e.getConstraintViolations();
        ConstraintViolation<?> constraintValidation = constraintValidations.iterator().next();
        return Response
                .status(Response.Status.REQUESTED_RANGE_NOT_SATISFIABLE)
                .header("Content-Range", "bytes */" + constraintValidation.getMessage()) // Required in 416.
                .build();
    }
}