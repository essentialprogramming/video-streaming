package com.api.validation;

import com.api.service.VideoStreamService;
import com.util.exceptions.ValidationException;
import com.util.text.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import javax.validation.*;
import javax.ws.rs.core.Response;

/**
 * Validators for the API.
 */
@Component
public class Validators {

    private static final Logger logger = LoggerFactory.getLogger(Validators.class);

    private final VideoStreamService videoStreamService;
    private final Validator validator;
    @Autowired
    public Validators(VideoStreamService videoStreamService, Validator validator) {
        this.videoStreamService = videoStreamService;
        //validator = Validation.buildDefaultValidatorFactory().getValidator();
        this.validator = validator;
    }

    @Documented
    @Constraint(validatedBy = { RangeValidator.class })
    @Target({ TYPE, METHOD, FIELD, LOCAL_VARIABLE, ANNOTATION_TYPE, PARAMETER })
    @Retention(RUNTIME)
    public @interface CheckRange {
        Class<?>[] groups() default {};

        String message() default "Range {value} is invalid!";

        Class<? extends Payload>[] payload() default {};

        boolean required() default false;

        String fileName() default "file";
    }



    /**
     * Range can be null, but if not it has to follow the
     * range pattern.
     */
    public class RangeValidator implements ConstraintValidator<CheckRange, String> {
        private boolean required;
        private String fileName;

        @Override
        public void initialize(final CheckRange validation) {
            required = validation.required();
            fileName = validation.fileName();
        }

        @Override
        public boolean isValid(final String vin, final ConstraintValidatorContext context) {
            if (required && StringUtils.isEmpty(vin)) {
                addConstraintViolation(context, "Value for range is required!");
                return false;
            }
            if (!required && StringUtils.isEmpty(vin)) {
                return true;
            }
            return validateRange(vin, fileName, context);
        }
    }


    /**
     * Validate range header format
     *
     * @param range    String
     * @param fileName String
     */
    private boolean validateRange(final String range, final String fileName, final ConstraintValidatorContext context) {
        // Range header should match format "bytes=n-n,n-n,n-n...". If not, then return 416.
        if (!range.matches("^bytes=\\d*-\\d*(,\\d*-\\d*)*$")) {
            throw new ValidationException("bytes */" + videoStreamService.getFileSize(fileName), Response.Status.REQUESTED_RANGE_NOT_SATISFIABLE);
        }
        return true;
    }



    private static void addConstraintViolation(final ConstraintValidatorContext context, final String message) {
        if (null != context) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(message).addConstraintViolation();
        }
    }
}
