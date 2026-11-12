# syntax=docker/dockerfile:1

# Build reprodutivel: Maven + Temurin 21 fixados por digest, nao por tag "latest"
# (tag pode mudar de conteudo; digest nao).
FROM maven@sha256:3a4ab3276a087bf276f79cae96b1af04f53731bec53fb2e651aca79e4b10211e AS build
WORKDIR /build

# Camada de dependencias isolada do codigo-fonte: so invalida o cache do Docker
# quando o pom.xml muda, nao a cada alteracao de classe.
COPY pom.xml .
RUN mvn -B -ntp dependency:go-offline

COPY src ./src
# Testes ja rodam em job dedicado do CI (unitario + integracao com Testcontainers);
# repeti-los aqui exigiria Docker-in-Docker so para empacotar o artefato.
RUN mvn -B -ntp -DskipTests clean package

# Imagem final enxuta: so o JRE, sem Maven nem repositorio .m2 do build.
FROM eclipse-temurin@sha256:ac05c3c42b7c2f1a52c9bd52f01041fa1958231b15ebeae7420429cbc5baf474 AS runtime

# Um processo por conteiner, sem privilegio de root (OWASP A04/A05 e convencao da casa).
RUN addgroup -g 10001 app && adduser -D -u 10001 -G app app
WORKDIR /app
COPY --from=build --chown=app:app /build/target/api.jar ./api.jar
USER app

EXPOSE 8080

# Configuracao só por variavel de ambiente (DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET, ...);
# nenhum segredo e copiado para a imagem (ver .dockerignore e .env.example).
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- "http://localhost:${SERVER_PORT:-8080}/actuator/health" | grep -q '"status":"UP"' || exit 1

ENTRYPOINT ["java", "-jar", "api.jar"]
