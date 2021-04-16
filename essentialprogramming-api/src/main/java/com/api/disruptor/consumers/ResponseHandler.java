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
            this.setResponseHeaders(fileType, range, servletResponse);
            this.setCorsHeaders(servletResponse);

            outputStream.write(data, 0, data.length);
            outputStream.flush();
        } catch (Exception ignore) {
        } finally {
            asyncContext.complete();
        }

    }

    private void setResponseHeaders(String fileType, Range range, HttpServletResponse response) {
        final String contentLength = String.valueOf(range.length);

        response.setStatus(Response.Status.PARTIAL_CONTENT.getStatusCode());
        response.setHeader(CONTENT_TYPE, VIDEO_CONTENT + fileType);
        response.setHeader(ACCEPT_RANGES, BYTES);
        response.setHeader(CONTENT_LENGTH, contentLength);
        response.setHeader(CONTENT_RANGE, BYTES + " " + range.start + "-" + range.end + "/" + range.total);
    }

    private void setCorsHeaders( HttpServletResponse response){
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept, authorization,  X-Requested-With, Content-Length");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
    }
}
