package com.api.events;

import com.api.model.Range;
import com.api.service.VideoStreamService;
import com.lmax.disruptor.EventTranslator;

import javax.servlet.AsyncContext;

public class StreamRequestTranslator implements EventTranslator<StreamFragment> {

    private final AsyncContext asyncContext;
    private final String fileName;
    private final String fileType;
    private final String byteRange;

    public StreamRequestTranslator(AsyncContext asyncContext, String fileName, String fileType, String byteRange) {
        this.asyncContext = asyncContext;
        this.fileName = fileName;
        this.fileType = fileType;
        this.byteRange = byteRange;
    }

    @Override
    public void translateTo(StreamFragment streamEvent, long l) {
        final String fullFileName = fileName + "." + fileType;
        final Range range = Range.of(byteRange, VideoStreamService.getInstance().getFileSize(fullFileName));

        streamEvent.setAsyncContext(asyncContext);
        streamEvent.setRange(range);
        streamEvent.setFileName(fullFileName);
        streamEvent.setFileType(fileType);
    }
}
