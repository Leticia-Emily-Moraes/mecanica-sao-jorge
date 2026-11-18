package br.com.mecanicasaojorge.api.controller;

import br.com.mecanicasaojorge.api.config.OpenApiConfig;
import br.com.mecanicasaojorge.api.dto.VeiculoDetalheResponse;
import br.com.mecanicasaojorge.api.dto.VeiculoListResponse;
import br.com.mecanicasaojorge.api.dto.VeiculoRequest;
import br.com.mecanicasaojorge.api.dto.VeiculoResponse;
import br.com.mecanicasaojorge.api.exception.ErrorResponse;
import br.com.mecanicasaojorge.api.service.VeiculoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import java.net.URI;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoints de veiculos (F04, ADR-024): criar e listar no cliente, detalhar e editar pelo id do
 * veiculo. Controller fino: valida a entrada e delega ao service.
 */
@RestController
@Tag(name = "Veiculos")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class VeiculoController {

  private static final String CLIENTE_VEICULOS = "/api/v1/clientes/{clienteId}/veiculos";
  private static final String VEICULO = "/api/v1/veiculos/{id}";

  private final VeiculoService veiculoService;

  public VeiculoController(VeiculoService veiculoService) {
    this.veiculoService = veiculoService;
  }

  @PostMapping(value = CLIENTE_VEICULOS, consumes = MediaType.APPLICATION_JSON_VALUE)
  @Operation(
      summary = "Cadastra um veiculo do cliente",
      description =
          "Placa no padrao antigo ou Mercosul, normalizada (maiuscula, sem hifen nem espaco) antes "
              + "de validar e de checar unicidade. O dono e o cliente do caminho; clienteId no "
              + "corpo e ignorado. Erros de campo vem em erros[] com campo e chave i18n.")
  @ApiResponse(
      responseCode = "201",
      description = "Veiculo criado; Location aponta para o detalhe",
      content = @Content(schema = @Schema(implementation = VeiculoResponse.class)))
  @ApiResponse(
      responseCode = "400",
      description = "Campo invalido ou ausente, ou JSON malformado; nunca repete o valor enviado",
      content =
          @Content(
              schema = @Schema(implementation = ErrorResponse.class),
              examples =
                  @ExampleObject(
                      value =
                          """
                          {"timestamp": "2026-11-18T10:00:00-03:00", "status": 400,
                           "erro": "Bad Request", "mensagem": "veiculo.form.placa.erro",
                           "path": "/api/v1/clientes/1/veiculos",
                           "erros": [{"campo": "placa", "chave": "veiculo.form.placa.erro"}]}""")))
  @ApiResponse(
      responseCode = "401",
      description = "Token ausente, invalido ou expirado",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "404",
      description = "Cliente inexistente",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "409",
      description = "Placa ja cadastrada; a mensagem nao traz a placa",
      content =
          @Content(
              schema = @Schema(implementation = ErrorResponse.class),
              examples =
                  @ExampleObject(
                      value =
                          """
                          {"timestamp": "2026-11-18T10:00:00-03:00", "status": 409,
                           "erro": "Conflict", "mensagem": "Placa ja cadastrada",
                           "path": "/api/v1/clientes/1/veiculos",
                           "erros": [{"campo": "placa",
                                      "chave": "veiculo.form.placa.duplicada"}]}""")))
  @ApiResponse(
      responseCode = "415",
      description = "Content-Type diferente de application/json",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  public ResponseEntity<VeiculoResponse> criar(
      @Parameter(description = "Identificador do cliente, inteiro positivo") @PathVariable @Positive
          Long clienteId,
      @Valid @RequestBody VeiculoRequest request,
      @AuthenticationPrincipal Jwt jwt) {
    VeiculoResponse criado = veiculoService.criar(clienteId, request, jwt.getSubject());
    return ResponseEntity.status(HttpStatus.CREATED)
        .location(URI.create("/api/v1/veiculos/" + criado.id()))
        .body(criado);
  }

  @GetMapping(CLIENTE_VEICULOS)
  @Operation(
      summary = "Lista os veiculos de um cliente",
      description =
          "Ordenada por placa, sem paginacao. Cliente sem veiculos devolve 200 com lista vazia.")
  @ApiResponse(
      responseCode = "200",
      description = "Veiculos do cliente",
      content =
          @Content(
              array = @ArraySchema(schema = @Schema(implementation = VeiculoListResponse.class))))
  @ApiResponse(
      responseCode = "400",
      description = "clienteId nao numerico, zero ou negativo",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "401",
      description = "Token ausente, invalido ou expirado",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "404",
      description = "Cliente inexistente",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  public ResponseEntity<List<VeiculoListResponse>> listarPorCliente(
      @Parameter(description = "Identificador do cliente, inteiro positivo") @PathVariable @Positive
          Long clienteId,
      @AuthenticationPrincipal Jwt jwt) {
    return ResponseEntity.ok(veiculoService.listarPorCliente(clienteId, jwt.getSubject()));
  }

  @GetMapping(VEICULO)
  @Operation(
      summary = "Detalha um veiculo",
      description =
          "Dados cadastrais, dono (clienteId e clienteNome) e historicoOs, sempre presente e "
              + "vazio ate existir a feature de Ordens de Servico.")
  @ApiResponse(
      responseCode = "200",
      description = "Detalhe do veiculo",
      content = @Content(schema = @Schema(implementation = VeiculoDetalheResponse.class)))
  @ApiResponse(
      responseCode = "400",
      description = "id nao numerico, zero ou negativo",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "401",
      description = "Token ausente, invalido ou expirado",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "404",
      description = "Veiculo inexistente",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  public ResponseEntity<VeiculoDetalheResponse> detalhar(
      @Parameter(description = "Identificador do veiculo, inteiro positivo") @PathVariable @Positive
          Long id,
      @AuthenticationPrincipal Jwt jwt) {
    return ResponseEntity.ok(veiculoService.detalhar(id, jwt.getSubject()));
  }

  @PutMapping(value = VEICULO, consumes = MediaType.APPLICATION_JSON_VALUE)
  @Operation(
      summary = "Edita um veiculo",
      description =
          "Substitui placa, marca, modelo, ano e cor. O dono nao muda: clienteId no corpo e "
              + "ignorado. Mandar a propria placa nao gera conflito.")
  @ApiResponse(
      responseCode = "200",
      description = "Veiculo atualizado",
      content = @Content(schema = @Schema(implementation = VeiculoResponse.class)))
  @ApiResponse(
      responseCode = "400",
      description = "Campo invalido ou ausente, ou JSON malformado",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "401",
      description = "Token ausente, invalido ou expirado",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "404",
      description = "Veiculo inexistente",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "409",
      description = "Placa pertence a outro veiculo",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "415",
      description = "Content-Type diferente de application/json",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  public ResponseEntity<VeiculoResponse> editar(
      @Parameter(description = "Identificador do veiculo, inteiro positivo") @PathVariable @Positive
          Long id,
      @Valid @RequestBody VeiculoRequest request,
      @AuthenticationPrincipal Jwt jwt) {
    return ResponseEntity.ok(veiculoService.editar(id, request, jwt.getSubject()));
  }
}
