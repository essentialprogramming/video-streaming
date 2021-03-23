package com.api.disruptor;

import com.api.disruptor.consumers.ResponseHandler;
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
public class StreamDisruptor {

    private final StreamFragmentFactory streamEventFactory;
    private final ResponseHandler responseHandler;

    private Disruptor<StreamFragment> disruptor;
    private final int ringBufferSize = (int) Math.pow(2,10);

    @Autowired
    public StreamDisruptor(StreamFragmentFactory streamEventFactory, ResponseHandler responseHandler) {
        this.streamEventFactory = streamEventFactory;
        this.responseHandler = responseHandler;
    }


    @PostConstruct
    public void constructDisruptorSingleConsumer() {
        disruptor = new Disruptor<>(streamEventFactory, ringBufferSize, DaemonThreadFactory.INSTANCE, ProducerType.SINGLE, new BlockingWaitStrategy());
        disruptor.handleEventsWith(responseHandler);

        disruptor.start();
    }
    public Disruptor<StreamFragment> getDisruptor() {
        return disruptor;
    }

}
