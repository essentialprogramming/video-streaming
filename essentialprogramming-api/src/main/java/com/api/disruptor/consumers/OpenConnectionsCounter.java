package com.api.disruptor.consumers;

import com.api.events.StreamFragment;
import com.lmax.disruptor.EventHandler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

@Service
public class OpenConnectionsCounter implements EventHandler<StreamFragment> {
    public final Lock LOCK = new ReentrantLock();
    public final Condition newCondition = LOCK.newCondition();
    public static final AtomicLong counter = new AtomicLong();

    @Autowired
    public OpenConnectionsCounter() {
    }

    @Override
    public void onEvent(StreamFragment streamEvent, long sequence, boolean endOfBatch) throws Exception {
        counter.incrementAndGet();
        //Thread.sleep(1000);
        System.out.println("Increment: " + OpenConnectionsCounter.counter.get());
        try {
            if (counter.get() > 10) {
                LOCK.lock();
                System.out.println("Waiting");
                newCondition.awaitNanos(100000000);
                LOCK.unlock();
            }
        } catch (InterruptedException ignore) {
        }

    }


}
