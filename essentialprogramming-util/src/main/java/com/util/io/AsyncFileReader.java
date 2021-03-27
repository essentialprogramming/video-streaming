package com.util.io;


import lombok.SneakyThrows;

import java.io.*;
import java.nio.ByteBuffer;
import java.nio.channels.AsynchronousFileChannel;
import java.nio.channels.CompletionHandler;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.concurrent.CompletableFuture;

import static java.util.concurrent.CompletableFuture.completedFuture;

/**
 * Asynchronous non-blocking read operations that use an underlying AsynchronousFileChannel.
 *
 * @author Razvan Prichici
 */
public class AsyncFileReader {

    private AsyncFileReader() {
    }

    public static CompletableFuture<byte[]> readBytes(String fileName, int start, int length) {
        CompletableFuture<byte[]> promise = new CompletableFuture<>();
        final File file = FileUtils.getFile(fileName);
        if ( file == null)  {
            promise.completeExceptionally(new FileNotFoundException());
            return promise;
        }
        final Path path = Paths.get(file.toURI());
        try {
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            AsynchronousFileChannel asyncFile = AsynchronousFileChannel.open(path, StandardOpenOption.READ);
            promise =
                    AsyncFileReader.readBytes(asyncFile, buffer, start, length, outputStream)
                            .thenApply(position -> outputStream.toByteArray())
                            .whenCompleteAsync((position, exception) -> closeFileChannel(asyncFile));

        } catch (Exception exception) {
            promise.completeExceptionally(exception);
        }
        return promise;

    }

    private static CompletableFuture<Integer> readBytes(AsynchronousFileChannel asyncFile, ByteBuffer buffer,
                                                        int position, int length, ByteArrayOutputStream outputStream) {
        return readToByteArray(asyncFile, buffer, position, length, outputStream)
                .thenCompose(index -> index < 0 || length <= 0
                        ? completedFuture(position)
                        : readBytes(asyncFile, (ByteBuffer) buffer.clear(), position + index, length - index, outputStream));

    }

    static CompletableFuture<Integer> readToByteArray(AsynchronousFileChannel asyncFile, ByteBuffer buffer,
                                                      int position, int toRead, ByteArrayOutputStream outputStream) {
        CompletableFuture<Integer> promise = new CompletableFuture<>();
        asyncFile.read(buffer, position, buffer, new CompletionHandler<Integer, ByteBuffer>() {
            @SneakyThrows
            @Override
            public void completed(Integer nRead, ByteBuffer attachment) {
                if (nRead > 0 && toRead > 0) {
                    attachment.flip();
                    byte[] data = new byte[attachment.limit()]; // limit = nRead
                    attachment.get(data);
                    if ((toRead - nRead) > 0) {
                        outputStream.write(data, 0, nRead);
                    } else {
                        outputStream.write(data, 0, toRead);
                    }
                    outputStream.flush();

                }
                promise.complete(nRead);
            }

            @Override
            public void failed(Throwable exception, ByteBuffer attachment) {
                promise.completeExceptionally(exception);
            }
        });
        return promise;
    }

    private static void closeFileChannel(AsynchronousFileChannel asyncFile) {
        try {
            asyncFile.close();
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

}

