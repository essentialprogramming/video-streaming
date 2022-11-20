package com.api.stream;

/**
 * A byte array based buffer. The payload can be an arbitrary region of the array.
 */
public class Buffer {
    
    private final byte[] data;
    private int offset;
    private int length;
    
    /**
     * Creates a </code>StreamBuffer</code> with the given size.
     * 
     * @param size Desired capacity of the buffer.
     */
    public Buffer(int size) {
        data = new byte[size];
    }
    
    /**
     * Creates a </code>StreamBuffer</code> backed by the given array. Contents
     * of the given array will be changed by the object.
     * 
     * @param buffer Array to use.
     * @param offset Beginning of data in the buffer.
     * @param length Length of data.
     */
    public Buffer(byte[] buffer, int offset, int length) {
        data = buffer;
        this.offset = offset;
        this.length = length;
    }
    
    /**
     * Moves the payload of this buffer to the start of the array.
     */
    public void compact() {
        System.arraycopy(data, offset, data, 0, length);
        offset = 0;
    }
    
    /**
     * Gets the array containing the data of this buffer.
     */
    public byte[] getData() {
        return data;
    }

    /**
     * Gets the offset of the first byte containing the data of this buffer
     * inside the buffer array.
     */
    public int getOffset() {
        return offset;
    }
    
    /**
     * Signals that the first <code>numOfBytes</code> bytes has been processed
     * and should not be considered as part of the payload anymore.
     * @param numOfBytes The number of bytes processed.
     */
    public void markProcessed(int numOfBytes) {
        if (numOfBytes < 0)
            throw new RuntimeException("Negative number of bytes is unsupported: " + numOfBytes);
        if (numOfBytes > length)
            throw new RuntimeException("Region too big: " + numOfBytes + " (length is: " + length + ").");
        
        length -= numOfBytes;
        offset += numOfBytes;
    }
    
    /**
     * Signals that <code>numOfBytes</code> bytes of new data has been appended
     * to the end of the payload.
     * @param numOfBytes The number of bytes appended.
     */
    public void markAppended(int numOfBytes) {
        if (numOfBytes < 0)
            throw new RuntimeException("Negative number of bytes is unsupported: " + numOfBytes);
        if (numOfBytes > data.length - (offset + length))
            throw new RuntimeException("Region too big: " + numOfBytes + " (empty space is: " + (data.length - (offset + length)) + ").");
        
        length += numOfBytes;
    }
    
    /**
     * Gets the number of bytes containing the data of this buffer.
     */
    public int getLength() {
        return length;
    }
    
}
