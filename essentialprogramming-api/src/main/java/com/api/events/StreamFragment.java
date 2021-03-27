package com.api.events;

import com.api.model.Range;
import com.util.text.StringUtils;
import javax.servlet.AsyncContext;
import java.lang.ref.SoftReference;
import java.util.Optional;

import static com.api.constants.ApplicationConstants.*;

public class StreamFragment {

    private String fileName;
    private String fileType;
    private Range range;
    private SoftReference<byte[]> data;
    private AsyncContext asyncContext;

    public StreamFragment() {

    }

    public StreamFragment(String fileName, String fileType, Range range, byte[] data, AsyncContext asyncContext) {
        this.fileName = fileName;
        this.fileType = fileType;
        this.range = range;
        this.data = new SoftReference<>(data);
        this.asyncContext = asyncContext;
    }

    public byte[] getData() {
        return Optional.ofNullable(data).map(SoftReference::get).orElse(SHORT_BYTE);
    }
    public void setData(byte[] data){
        this.data = new SoftReference<>(data);
    }

    public String getFileName() {
        return fileName;
    }
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }
    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Range getRange() {
        return range;
    }
    public void setRange(Range range) {
        this.range = range;
    }

    public AsyncContext getAsyncContext() {
        return asyncContext;
    }
    public void setAsyncContext(AsyncContext asyncContext) {
        this.asyncContext = asyncContext;
    }

    public boolean isValid() {
        if (StringUtils.isEmpty(fileName)) return false;
        if (StringUtils.isEmpty(fileType)) return false;
        return range != null;
    }

    public void clear() {
        this.fileName = null;
        this.fileType = null;
        this.range = null;
        this.data = null;
        this.asyncContext = null;
    }

    @Override
    public String toString() {
        return "StreamFragment{" +
                "fileName='" + fileName + '\'' +
                ", fileType='" + fileType + '\'' +
                ", range=" + range +
                '}';
    }
}