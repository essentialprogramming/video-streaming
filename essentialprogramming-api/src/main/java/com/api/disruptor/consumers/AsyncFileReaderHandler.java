package com.api.disruptor.consumers;

import com.api.disruptor.StreamDisruptor;
import com.api.events.StreamFragment;
import com.api.model.Range;
import com.api.service.VideoStreamService;
import com.lmax.disruptor.EventHandler;
import com.lmax.disruptor.EventTranslator;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.servlet.AsyncContext;

@Service
@Slf4j
@RequiredArgsConstructor
public class AsyncFileReaderHandler implements EventHandler<StreamFragment> {

    private final VideoStreamService videoStreamService;
    private final StreamDisruptor streamEventDisruptor;


    @Override
    public void onEvent(StreamFragment streamEvent, long sequence, boolean endOfBatch) throws Exception {
        //System.out.println("Sequence: " + sequence);
        if (!streamEvent.isValid()) {
            return;
        }

        final Range range = streamEvent.getRange();
        videoStreamService.readByteRangeAsync(streamEvent.getFileName(), range.start, range.end)
                .thenAccept(data -> publish(streamEvent.getFileType(), range, data, streamEvent.getAsyncContext()))
                .whenComplete((result, ex) -> streamEvent.clear());
    }

    @SneakyThrows
    private void publish(String fileType, Range range, byte[] data, AsyncContext asyncContext) {
        OpenConnectionsCounter.decrement();
        EventTranslator<StreamFragment> eventTranslator = (videoFragment, sequence) -> {
            videoFragment.setData(data);
            videoFragment.setFileType(fileType);
            videoFragment.setAsyncContext(asyncContext);
            videoFragment.setRange(range);

        };

        streamEventDisruptor.getDisruptor().publishEvent(eventTranslator);
    }
}
