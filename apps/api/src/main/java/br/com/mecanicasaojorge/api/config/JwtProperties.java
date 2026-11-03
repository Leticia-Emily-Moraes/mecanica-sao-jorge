package br.com.mecanicasaojorge.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuracao de JWT (ADR-004). Sem validacao obrigatoria nesta etapa: os valores reais sao
 * exigidos apenas quando a feature de Login passar a emitir e validar tokens.
 */
@ConfigurationProperties(prefix = "jwt")
public record JwtProperties(String secret, int expirationMinutes) {}
