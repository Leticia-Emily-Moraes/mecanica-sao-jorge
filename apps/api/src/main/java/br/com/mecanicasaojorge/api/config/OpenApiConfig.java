package br.com.mecanicasaojorge.api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

  @Bean
  public OpenAPI apiInfo() {
    return new OpenAPI()
        .info(
            new Info()
                .title("Mecanica Sao Jorge API")
                .description("Gestao de clientes, veiculos, ordens de servico e financeiro")
                .version("v1"));
  }
}
