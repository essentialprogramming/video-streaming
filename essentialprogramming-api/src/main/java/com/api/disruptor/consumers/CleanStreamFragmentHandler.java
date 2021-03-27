package com.api.disruptor.consumers;


import com.api.events.StreamFragment;
import com.lmax.disruptor.EventHandler;
import org.springframework.stereotype.Service;

/**
 * When transferring data through Disruptor, the life of the object may exceed expectations. To avoid this, you may need to clear the event after handling the event.
 * If you have an event handler that clears values from the same handler, that's enough.
 * If you have a series of event handlers, you may need to place a specific handler at the end of the chain to handle the cleanup object.
 * <p>
 * Clearing objects from ring buffers
 */
@Service
public class CleanStreamFragmentHandler implements EventHandler<StreamFragment> {
    @Override
    public void onEvent(StreamFragment streamEvent, long sequence, boolean endOfBatch) {
        if (streamEvent == null) return;
        streamEvent.clear();
    }
}
