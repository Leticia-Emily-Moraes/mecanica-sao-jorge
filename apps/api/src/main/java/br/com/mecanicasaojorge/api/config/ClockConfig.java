package br.com.mecanicasaojorge.api.config;

import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Relogio injetavel: regras que dependem da data (ex.: faixa do ano do veiculo) ficam testaveis.
 */
@Configuration
public class ClockConfig {

  @Bean
  public Clock clock() {
    return Clock.systemDefaultZone();
  }
}
