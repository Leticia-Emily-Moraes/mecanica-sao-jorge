package br.com.mecanicasaojorge.api.controller;

import br.com.mecanicasaojorge.api.config.OpenApiConfig;
import br.com.mecanicasaojorge.api.dto.PaginaResponse;
import br.com.mecanicasaojorge.api.dto.ServicoListResponse;
import br.com.mecanicasaojorge.api.exception.ErrorResponse;
import br.com.mecanicasaojorge.api.service.ServicoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** Endpoints do catalogo de servicos. Controller fino: valida a entrada e delega ao service. */
@RestController
@RequestMapping("/api/v1/servicos")
@Tag(name = "Servicos")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class ServicoController {

  private final ServicoService servicoService;

  public ServicoController(ServicoService servicoService) {
    this.servicoService = servicoService;
  }

  @GetMapping
  @Operation(
      summary = "Lista servicos com busca opcional",
      description =
          "Busca por trecho no nome, sem diferenciar maiusculas e acentos. O termo vale como "
              + "texto literal. O filtro ativo e opcional: ausente lista ativos e inativos. "
              + "Ordenado por nome e id. Pagina alem do fim devolve 200 com lista vazia e o "
              + "total real.")
  @ApiResponse(responseCode = "200", description = "Pagina de servicos")
  @ApiResponse(
      responseCode = "400",
      description =
          "Parametro invalido (size fora de 1..100, page negativa, q com mais de 100, ativo nao "
              + "booleano)",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "401",
      description = "Token ausente, invalido ou expirado",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "500",
      description = "Erro interno inesperado",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  public ResponseEntity<PaginaResponse<ServicoListResponse>> listar(
      @Parameter(description = "Termo de busca no nome (maximo 100 caracteres)")
          @RequestParam(required = false)
          @Size(max = 100)
          String q,
      @Parameter(description = "Filtro: true so ativos, false so inativos; ausente lista todos")
          @RequestParam(required = false)
          Boolean ativo,
      @Parameter(description = "Pagina, base 0") @RequestParam(defaultValue = "0") @Min(0) int page,
      @Parameter(description = "Itens por pagina, de 1 a 100")
          @RequestParam(defaultValue = "20")
          @Min(1)
          @Max(100)
          int size,
      @AuthenticationPrincipal Jwt jwt) {
    return ResponseEntity.ok(servicoService.listar(q, ativo, page, size, jwt.getSubject()));
  }
}
