FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

COPY bytebuzz-backend /app

RUN mvn -f /app/pom.xml clean package -DskipTests

FROM eclipse-temurin:17-jdk
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

CMD ["java", "-jar", "app.jar"]
