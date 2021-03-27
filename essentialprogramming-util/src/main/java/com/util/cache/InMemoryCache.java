package com.util.cache;

import java.lang.ref.SoftReference;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

public class InMemoryCache implements Cache {

    private final ConcurrentHashMap<String, SoftReference<Object>> cache = new ConcurrentHashMap<>();
    private static class InMemoryCacheHolder {
        static final InMemoryCache INSTANCE = new InMemoryCache();
    }

    public static InMemoryCache getInstance(){
        return InMemoryCacheHolder.INSTANCE;
    }

    @Override
    public void add(String key, Object value) {
        if (key == null) {
            return;
        }
        if (value == null) {
            cache.remove(key);
        } else {
            SoftReference<Object> reference = new SoftReference<>(value);
            cache.putIfAbsent(key, reference);
        }
    }

    @Override
    public void remove(String key) {
        cache.remove(key);
    }

    @Override
    public Optional<Object> get(String key) {
        return Optional.ofNullable(cache.get(key)).map(SoftReference::get);
    }

    @Override
    public void clear() {
        cache.clear();
    }

    @Override
    public long size() {
        return cache.size();
    }

}
