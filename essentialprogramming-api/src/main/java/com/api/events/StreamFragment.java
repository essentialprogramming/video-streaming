package com.api.events;

import com.api.model.Range;
import lombok.Getter;
import lombok.Setter;

import javax.servlet.AsyncContext;

@Getter
@Setter
public class StreamFragment {

    private String fileName;
    private String fileType;
    private Range range;
    private byte[] data;
    private AsyncContext asyncContext;

    public StreamFragment(){

    }
    public StreamFragment(String fileName, String fileType, Range range, byte[] data, AsyncContext asyncContext) {
        this.fileName = fileName;
        this.fileType = fileType;
        this.range = range;
        this.data = data;
        this.asyncContext = asyncContext;
    }
}