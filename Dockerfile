#stage build
FROM maven:3.6.3-jdk-8 AS builder

WORKDIR /app

COPY . .

RUN mvn clean install -Dmaven.test.skip=true

#stage deploy
FROM openjdk:8-jre
COPY --from=builder /app/essentialprogramming-api/target/essentialprogramming-http-video-streaming.jar /app/essentialprogramming-http-video-streaming.jar

EXPOSE 8082

CMD java -jar ./app/essentialprogramming-http-video-streaming.jar