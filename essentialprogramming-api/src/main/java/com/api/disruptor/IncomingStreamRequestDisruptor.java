package com.api.disruptor;

import com.api.disruptor.consumers.AsyncFileReaderHandler;
import com.api.disruptor.consumers.OpenConnectionsCounter;
import com.api.events.StreamFragment;
import com.api.events.StreamFragmentFactory;
import com.lmax.disruptor.BlockingWaitStrategy;
import com.lmax.disruptor.dsl.Disruptor;
import com.lmax.disruptor.dsl.ProducerType;
import com.lmax.disruptor.util.DaemonThreadFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class IncomingStreamRequestDisruptor {

    private final StreamFragmentFactory streamEventFactory;
    private final AsyncFileReaderHandler asyncFileReaderHandler;
    private final OpenConnectionsCounter fileReadersCounter;

    @Autowired
    public IncomingStreamRequestDisruptor(StreamFragmentFactory streamEventFactory, AsyncFileReaderHandler asyncFileReaderHandler, OpenConnectionsCounter fileReadersCounter) {
        this.streamEventFactory = streamEventFactory;
        this.asyncFileReaderHandler = asyncFileReaderHandler;
        this.fileReadersCounter = fileReadersCounter;
    }

    private Disruptor<StreamFragment> disruptor;
    private final int ringBufferSize = (int) Math.pow(2, 15);

    @PostConstruct
    public void constructDisruptor() {

        disruptor = new Disruptor<>(streamEventFactory, ringBufferSize, DaemonThreadFactory.INSTANCE, ProducerType.SINGLE, new BlockingWaitStrategy());
        disruptor.handleEventsWith(fileReadersCounter).then(asyncFileReaderHandler);

        disruptor.start();
    }

    public Disruptor<StreamFragment> getDisruptor() {
        return disruptor;
    }
}
