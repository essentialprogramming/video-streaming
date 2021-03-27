package com.api.disruptor.consumers;

import com.api.events.StreamFragment;
import com.api.model.Range;
import com.lmax.disruptor.EventHandler;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

import javax.servlet.AsyncContext;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Response;


import static com.api.constants.ApplicationConstants.*;


@Service
public class ResponseHandler implements EventHandler<StreamFragment> {

    @Override
    public void onEvent(StreamFragment streamEvent, long sequence, boolean endOfBatch) {
        try {
            writeFragment(streamEvent.getFileType(), streamEvent.getRange(), streamEvent.getData(), streamEvent.getAsyncContext());
        } catch (Exception ignore) {
        }
    }

    @SneakyThrows
    private void writeFragment(String fileType, Range range, byte[] data, AsyncContext asyncContext) {
        try (ServletOutputStream outputStream = asyncContext.getResponse().getOutputStream()) {
            final HttpServletResponse servletResponse = (HttpServletResponse) asyncContext.getResponse();
            ResponseHandler.setResponseHeaders(fileType, range, servletResponse);

            outputStream.write(data, 0, data.length);
            outputStream.flush();
        } catch (Exception ignore) {
        } finally {
            asyncContext.complete();
        }

    }

    private static void setResponseHeaders(String fileType, Range range, HttpServletResponse response) {
        final String contentLength = String.valueOf(range.length);

        response.setStatus(Response.Status.PARTIAL_CONTENT.getStatusCode());
        response.setHeader(CONTENT_TYPE, VIDEO_CONTENT + fileType);
        response.setHeader(ACCEPT_RANGES, BYTES);
        response.setHeader(CONTENT_LENGTH, contentLength);
        response.setHeader(CONTENT_RANGE, BYTES + " " + range.start + "-" + range.end + "/" + range.total);
    }
}
