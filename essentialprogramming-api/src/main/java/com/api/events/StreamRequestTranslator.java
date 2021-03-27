package com.api.events;

import com.api.model.Range;
import com.api.service.VideoStreamService;
import com.lmax.disruptor.EventTranslator;
import com.util.cache.Cache;
import com.util.cache.InMemoryCache;

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
    public void translateTo(StreamFragment streamEvent, long sequence) {
        final String fullFileName = fileName + "." + fileType;
        final Cache cache = InMemoryCache.getInstance();
        if (!cache.get(fullFileName).isPresent()){
            cache.add(fullFileName, VideoStreamService.getInstance().getFileSize(fullFileName));
        }
        final Long fileSize = (Long) cache.get(fullFileName).orElse(VideoStreamService.getInstance().getFileSize(fullFileName));
        final Range range = Range.of(byteRange, fileSize);

        streamEvent.setAsyncContext(asyncContext);
        streamEvent.setRange(range);
        streamEvent.setFileName(fullFileName);
        streamEvent.setFileType(fileType);
    }
}
