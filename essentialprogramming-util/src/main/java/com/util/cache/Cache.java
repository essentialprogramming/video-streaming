package com.util.cache;

import java.util.Optional;

public interface Cache {

    void add(String key, Object value);

    void remove(String key);

    Optional<Object> get(String key);

    void clear();

    long size();
}