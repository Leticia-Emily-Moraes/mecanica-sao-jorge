package br.com.mecanicasaojorge.api.security;

import br.com.mecanicasaojorge.api.config.JwtProperties;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.nio.charset.StandardCharsets;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

/**
 * JwtEncoder/JwtDecoder HS256 sobre chave simetrica (ADR-004). A propria API emite e valida o
 * token, sem servidor de autorizacao externo nem JWKS remoto.
 */
@Configuration
public class JwtConfig {

  private static final int SECRET_MIN_BYTES = 32;

  @Bean
  SecretKeySpec jwtSecretKey(JwtProperties jwtProperties) {
    byte[] bytes = jwtProperties.secret().getBytes(StandardCharsets.UTF_8);
    if (bytes.length < SECRET_MIN_BYTES) {
      throw new IllegalStateException(
          "jwt.secret deve ter pelo menos "
              + SECRET_MIN_BYTES
              + " bytes para HS256 (ADR-004); configure JWT_SECRET");
    }
    return new SecretKeySpec(bytes, "HmacSHA256");
  }

  @Bean
  JwtEncoder jwtEncoder(SecretKeySpec jwtSecretKey) {
    return new NimbusJwtEncoder(new ImmutableSecret<>(jwtSecretKey));
  }

  @Bean
  JwtDecoder jwtDecoder(SecretKeySpec jwtSecretKey) {
    return NimbusJwtDecoder.withSecretKey(jwtSecretKey).macAlgorithm(MacAlgorithm.HS256).build();
  }
}
