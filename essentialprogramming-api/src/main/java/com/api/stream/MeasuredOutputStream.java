package com.api.stream;

import java.io.IOException;
import java.io.OutputStream;

/**
 * Decorates an OutputStream object, generating TransferEvents on writes. Data
 * is being written in chunks to achieve a better time-resolution with the
 * events. Smaller chunk sizes lead to better resolution on cost of resources.
 * <p>
 * To avoid unnecessary resource usage the last <i>chunkSize / 2</i> bytes are
 * written together with the last chunk.
 */
public class MeasuredOutputStream extends OutputStream {

    private final int DEFAULT_PACKET_SIZE = 64 * 1024;

    protected OutputStream base;


    protected int chunkSize = DEFAULT_PACKET_SIZE;

    /**
     * Wraps the given output stream. Uses default packet size.
     *
     * @param base Existing output stream to use.
     */
    public MeasuredOutputStream(OutputStream base) {
        this.base = base;
    }


    /**
     * Wraps the given output stream and sets a custom packet size.
     *
     * @param base       Existing output stream to use.
     * @param packetSize Size of the chunks of data written at one time.
     */
    public MeasuredOutputStream(OutputStream base, int packetSize) {
        this(base);
        this.chunkSize = packetSize;
    }


    @Override
    public void write(int i) throws IOException {
        byte[] buffer = {(byte) i};
        write(buffer, 0, 1);
    }

    @Override
    public void write(byte[] buffer) throws IOException {
        write(buffer, 0, buffer.length);
    }

    @Override
    public void write(byte[] buffer, int offset, int length) throws IOException {

        while (length > 0) {

            // current packet size
            int fragLength = length;
            if (fragLength >= 1.5 * chunkSize)
                fragLength = chunkSize;

            // writing data packet
            base.write(buffer, offset, fragLength);


            // next packet (chunk) start
            offset += fragLength;
            length -= fragLength;
        }
    }

}
