package br.com.mecanicasaojorge.api.controller;

import br.com.mecanicasaojorge.api.config.OpenApiConfig;
import br.com.mecanicasaojorge.api.dto.ClienteDetalheResponse;
import br.com.mecanicasaojorge.api.dto.ClienteListResponse;
import br.com.mecanicasaojorge.api.dto.ClienteRequest;
import br.com.mecanicasaojorge.api.dto.PaginaResponse;
import br.com.mecanicasaojorge.api.exception.ErrorResponse;
import br.com.mecanicasaojorge.api.service.ClienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.net.URI;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** Endpoints de clientes. Controller fino: valida a entrada e delega ao service. */
@RestController
@RequestMapping("/api/v1/clientes")
@Tag(name = "Clientes")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class ClienteController {

  private final ClienteService clienteService;

  public ClienteController(ClienteService clienteService) {
    this.clienteService = clienteService;
  }

  @GetMapping
  @Operation(
      summary = "Lista clientes com busca opcional",
      description =
          "Busca por trecho em nome e email, sem diferenciar maiusculas e acentos. O telefone so "
              + "e consultado quando o termo e numerico (digitos e simbolos de mascara: "
              + "parenteses, espaco, hifen, ponto e +), com ou sem mascara. O termo vale como "
              + "texto literal. Ordenado por nome e id. Pagina alem do fim devolve 200 com lista "
              + "vazia e o total real.")
  @ApiResponse(responseCode = "200", description = "Pagina de clientes")
  @ApiResponse(
      responseCode = "400",
      description = "Parametro invalido (size fora de 1..100, page negativa, q com mais de 100)",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "401",
      description = "Token ausente, invalido ou expirado",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "500",
      description = "Erro interno inesperado",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  public ResponseEntity<PaginaResponse<ClienteListResponse>> listar(
      @Parameter(description = "Termo de busca (maximo 100 caracteres)")
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
    return ResponseEntity.ok(clienteService.listar(q, page, size, jwt.getSubject()));
  }

  @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
  @Operation(
      summary = "Cadastra um cliente",
      description =
          "CPF e telefone aceitos com ou sem mascara e gravados so com digitos. CPF repetido "
              + "responde 409 (indice unico, ADR-020). O Location e relativo.",
      requestBody =
          @io.swagger.v3.oas.annotations.parameters.RequestBody(
              content =
                  @Content(
                      examples =
                          @ExampleObject(
                              name = "Cliente completo",
                              value =
                                  """
                                  {"nome": "Ana Exemplo", "cpf": "123.456.789-00",
                                   "telefone": "(20) 91234-5678", "email": "ana@example.com",
                                   "endereco": "Rua Modelo, 100 - Jardim Exemplo"}"""))))
  @ApiResponse(
      responseCode = "201",
      description = "Cliente criado; Location aponta para o detalhe",
      content = @Content(schema = @Schema(implementation = ClienteDetalheResponse.class)))
  @ApiResponse(
      responseCode = "400",
      description =
          "Campo invalido ou ausente (nome, cpf, telefone, email) ou JSON malformado; a mensagem "
              + "cita o campo e nunca o valor enviado",
      content =
          @Content(
              schema = @Schema(implementation = ErrorResponse.class),
              examples =
                  @ExampleObject(
                      value =
                          """
                          {"timestamp": "2026-11-17T10:00:00-03:00", "status": 400,
                           "erro": "Bad Request", "mensagem": "cpf deve ter 11 digitos",
                           "path": "/api/v1/clientes"}""")))
  @ApiResponse(
      responseCode = "401",
      description = "Token ausente, invalido ou expirado",
      content =
          @Content(
              schema = @Schema(implementation = ErrorResponse.class),
              examples =
                  @ExampleObject(
                      value =
                          """
                          {"timestamp": "2026-11-17T10:00:00-03:00", "status": 401,
                           "erro": "Unauthorized", "mensagem": "Nao autenticado",
                           "path": "/api/v1/clientes"}""")))
  @ApiResponse(
      responseCode = "409",
      description = "CPF ou email ja pertence a outro cliente; a mensagem nao traz o valor",
      content =
          @Content(
              schema = @Schema(implementation = ErrorResponse.class),
              examples =
                  @ExampleObject(
                      value =
                          """
                          {"timestamp": "2026-11-17T10:00:00-03:00", "status": 409,
                           "erro": "Conflict", "mensagem": "CPF ja cadastrado",
                           "path": "/api/v1/clientes"}""")))
  @ApiResponse(
      responseCode = "415",
      description = "Content-Type diferente de application/json",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "500",
      description = "Erro interno inesperado",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  public ResponseEntity<ClienteDetalheResponse> criar(
      @Valid @RequestBody ClienteRequest request, @AuthenticationPrincipal Jwt jwt) {
    ClienteDetalheResponse criado = clienteService.criar(request, jwt.getSubject());
    return ResponseEntity.status(HttpStatus.CREATED)
        .location(URI.create("/api/v1/clientes/" + criado.id()))
        .body(criado);
  }

  @GetMapping("/{id}")
  @Operation(
      summary = "Detalha um cliente",
      description =
          "Unica rota que devolve o CPF inteiro (11 digitos, sem mascara; a mascara e da tela). "
              + "Campos sem valor saem como null. A resposta nao e guardada em cache.")
  @ApiResponse(
      responseCode = "200",
      description = "Detalhe do cliente",
      content = @Content(schema = @Schema(implementation = ClienteDetalheResponse.class)))
  @ApiResponse(
      responseCode = "400",
      description = "id nao numerico, zero, negativo ou acima de Long.MAX_VALUE",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "401",
      description = "Token ausente, invalido ou expirado",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "404",
      description = "Nao existe cliente com o id",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "500",
      description = "Erro interno inesperado",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  public ResponseEntity<ClienteDetalheResponse> detalhar(
      @Parameter(description = "Identificador do cliente, inteiro positivo") @PathVariable @Positive
          Long id,
      @AuthenticationPrincipal Jwt jwt) {
    return ResponseEntity.ok(clienteService.detalhar(id, jwt.getSubject()));
  }

  @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
  @Operation(
      summary = "Edita um cliente",
      description =
          "Substitui todos os campos editaveis; opcional omitido ou em branco grava null. O id vem "
              + "so do caminho; id no corpo e ignorado. CPF e email sao comparados na forma "
              + "normalizada, sem contar o proprio cliente. Duas edicoes simultaneas: a ultima "
              + "gravacao vence.",
      requestBody =
          @io.swagger.v3.oas.annotations.parameters.RequestBody(
              content =
                  @Content(
                      examples =
                          @ExampleObject(
                              name = "Cliente completo",
                              value =
                                  """
                                  {"nome": "Ana Exemplo", "cpf": "123.456.789-00",
                                   "telefone": "(00) 91234-5678", "email": "ana@example.com",
                                   "endereco": "Rua Modelo, 100 - Jardim Exemplo"}"""))))
  @ApiResponse(
      responseCode = "200",
      description = "Cliente editado, com os valores gravados",
      content = @Content(schema = @Schema(implementation = ClienteDetalheResponse.class)))
  @ApiResponse(
      responseCode = "400",
      description =
          "Campo invalido ou ausente, id invalido ou JSON malformado; a mensagem cita o campo e "
              + "nunca o valor enviado",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "401",
      description = "Token ausente, invalido ou expirado",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "404",
      description = "Nao existe cliente com o id",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "409",
      description =
          "CPF ou email ja pertence a outro cliente, ou gravacao simultanea; a mensagem nao traz "
              + "o valor nem o id do outro cliente",
      content =
          @Content(
              schema = @Schema(implementation = ErrorResponse.class),
              examples =
                  @ExampleObject(
                      value =
                          """
                          {"timestamp": "2026-11-18T10:00:00-03:00", "status": 409,
                           "erro": "Conflict", "mensagem": "Email ja cadastrado",
                           "path": "/api/v1/clientes/1", "erros": []}""")))
  @ApiResponse(
      responseCode = "415",
      description = "Content-Type diferente de application/json",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  @ApiResponse(
      responseCode = "500",
      description = "Erro interno inesperado",
      content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  public ResponseEntity<ClienteDetalheResponse> atualizar(
      @Parameter(description = "Identificador do cliente, inteiro positivo") @PathVariable @Positive
          Long id,
      @Valid @RequestBody ClienteRequest request,
      @AuthenticationPrincipal Jwt jwt) {
    return ResponseEntity.ok(clienteService.atualizar(id, request, jwt.getSubject()));
  }
}
