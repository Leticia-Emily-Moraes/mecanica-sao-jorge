package br.com.mecanicasaojorge.api.controller;

import br.com.mecanicasaojorge.api.config.OpenApiConfig;
import br.com.mecanicasaojorge.api.dto.OrdemServicoListResponse;
import br.com.mecanicasaojorge.api.dto.PaginaResponse;
import br.com.mecanicasaojorge.api.entity.StatusOS;
import br.com.mecanicasaojorge.api.exception.ErrorResponse;
import br.com.mecanicasaojorge.api.service.OrdemServicoService;
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

/** Endpoints das ordens de servico. Controller fino: valida a entrada e delega ao service. */
@RestController
@RequestMapping("/api/v1/ordens-servico")
@Tag(name = "Ordens de servico")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class OrdemServicoController {

  private final OrdemServicoService ordemServicoService;

  public OrdemServicoController(OrdemServicoService ordemServicoService) {
    this.ordemServicoService = ordemServicoService;
  }

  @GetMapping
  @Operation(
      summary = "Lista ordens de servico com filtro de status e busca por cliente ou placa",
      description =
          "Ordenado da abertura mais recente para a mais antiga, com id decrescente no empate. "
              + "status e q combinados valem com E. q busca por trecho no nome do cliente ou na "
              + "placa (sem diferenciar maiusculas e ignorando hifen) e vale como texto literal. "
              + "valorTotal e 0.00 enquanto a OS nao tem itens. previsaoEntrega e null quando "
              + "nao ha previsao. Pagina alem do fim devolve 200 com lista vazia e o total real.")
  @ApiResponse(responseCode = "200", description = "Pagina de ordens de servico")
  @ApiResponse(
      responseCode = "400",
      description =
          "Parametro invalido (status fora do enum, size fora de 1..100, page negativa, q com "
              + "mais de 100)",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "401",
      description = "Token ausente, invalido ou expirado",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "500",
      description = "Erro interno inesperado",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  public ResponseEntity<PaginaResponse<OrdemServicoListResponse>> listar(
      @Parameter(description = "Status exato da OS (nome do enum, ex.: ABERTA)")
          @RequestParam(required = false)
          StatusOS status,
      @Parameter(description = "Trecho do nome do cliente ou da placa (maximo 100 caracteres)")
          @RequestParam(required = false)
          @Size(max = 100)
          String q,
      @Parameter(description = "Pagina, base 0") @RequestParam(defaultValue = "0") @Min(0) int page,
      @Parameter(description = "Itens por pagina, de 1 a 100")
          @RequestParam(defaultValue = "20")
          @Min(1)
          @Max(100)
          int size,
      @AuthenticationPrincipal Jwt jwt) {
    return ResponseEntity.ok(ordemServicoService.listar(status, q, page, size, jwt.getSubject()));
  }
}
