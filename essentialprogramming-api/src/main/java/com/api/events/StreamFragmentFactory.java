package com.api.events;

import com.lmax.disruptor.EventFactory;
import org.springframework.stereotype.Service;


@Service
public class StreamFragmentFactory implements EventFactory<StreamFragment> {

    @Override
    public StreamFragment newInstance() {
        return new StreamFragment();
    }
}
