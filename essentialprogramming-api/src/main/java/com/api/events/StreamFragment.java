package com.api.events;

import com.api.model.Range;
import com.util.text.StringUtils;
import lombok.Getter;
import lombok.Setter;

import javax.servlet.AsyncContext;

@Getter
@Setter
public class StreamFragment {

    private String fileName;

    @Override
    public String toString() {
        return "StreamFragment{" +
                "fileName='" + fileName + '\'' +
                ", fileType='" + fileType + '\'' +
                ", range=" + range +
                '}';
    }

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

    public boolean isValid(){
        if (StringUtils.isEmpty(fileName)) return false;
        if (StringUtils.isEmpty(fileType)) return false;
        return range != null;
    }
}