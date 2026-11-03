package br.com.mecanicasaojorge.api.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Postura de seguranca da fundacao (ADR-004: autenticacao stateless via JWT).
 *
 * <p>Esta classe ainda NAO implementa autenticacao: nao ha filtro de JWT nem {@code
 * UserDetailsService} ligados aqui. Isso é intencional — a etapa de Setup do projeto nao implementa
 * regra de negocio de feature. O filtro de JWT e a validacao de credenciais entram com a feature de
 * Login, proxima na ordem do roadmap.
 *
 * <p>Com httpBasic e formLogin desabilitados e nenhum mecanismo de autenticacao configurado, toda
 * rota fora de {@link #PUBLIC_PATHS} responde 401 ate a feature de Login ser implementada —
 * comportamento esperado para esta etapa.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

  private static final String[] PUBLIC_PATHS = {
    "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/actuator/health"
  };

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http.csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(
            auth -> auth.requestMatchers(PUBLIC_PATHS).permitAll().anyRequest().authenticated())
        .httpBasic(AbstractHttpConfigurer::disable)
        .formLogin(AbstractHttpConfigurer::disable)
        .build();
  }
}
