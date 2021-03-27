package com.api.disruptor;

import com.api.disruptor.consumers.CleanStreamFragmentHandler;
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
    private final CleanStreamFragmentHandler cleanStreamFragmentHandler;

    private Disruptor<StreamFragment> disruptor;
    private final int ringBufferSize = (int) Math.pow(2, 12);

    @Autowired
    public StreamDisruptor(StreamFragmentFactory streamEventFactory, ResponseHandler responseHandler, CleanStreamFragmentHandler cleanStreamFragmentHandler) {
        this.streamEventFactory = streamEventFactory;
        this.responseHandler = responseHandler;
        this.cleanStreamFragmentHandler = cleanStreamFragmentHandler;
    }


    @PostConstruct
    public void constructDisruptorSingleConsumer() {
        disruptor = new Disruptor<>(streamEventFactory, ringBufferSize, DaemonThreadFactory.INSTANCE, ProducerType.SINGLE, new BlockingWaitStrategy());
        disruptor.handleEventsWith(responseHandler).then(cleanStreamFragmentHandler);

        disruptor.start();
    }

    public Disruptor<StreamFragment> getDisruptor() {
        return disruptor;
    }

}
