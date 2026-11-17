package br.com.mecanicasaojorge.api.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.time.OffsetDateTime;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

/**
 * Handler global de erros (ADR-011). Converte excecoes internas no formato publico padronizado;
 * detalhes de stack trace nunca chegam ao cliente.
 *
 * <p>Mapeamento de status: 400 validacao de entrada, 401 credencial de login invalida, 404 rota
 * inexistente, 405 metodo nao suportado, 422 regra de negocio ({@link AppError} generico), 500 erro
 * inesperado. O 401 de bearer token ausente/invalido/expirado e tratado fora daqui, pelo {@code
 * RestAuthenticationEntryPoint} do resource server (mesmo formato de corpo).
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

  private static final Logger LOG = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @ExceptionHandler(CredenciaisInvalidasException.class)
  public ResponseEntity<ErrorResponse> handleCredenciaisInvalidas(
      CredenciaisInvalidasException ex, HttpServletRequest request) {
    return buildResponse(HttpStatus.UNAUTHORIZED, ex.getMessage(), request);
  }

  @ExceptionHandler(AppError.class)
  public ResponseEntity<ErrorResponse> handleAppError(AppError ex, HttpServletRequest request) {
    return buildResponse(HttpStatus.UNPROCESSABLE_ENTITY, ex.getMessage(), request);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidation(
      MethodArgumentNotValidException ex, HttpServletRequest request) {
    String mensagem =
        ex.getBindingResult().getFieldErrors().stream()
            .map(FieldError::getDefaultMessage)
            .reduce((primeira, segunda) -> primeira + "; " + segunda)
            .orElse("Dados invalidos");
    return buildResponse(HttpStatus.BAD_REQUEST, mensagem, request);
  }

  /**
   * Validacao de parametro de rota/query (ADR-017). A mensagem cita so o nome do parametro, nunca o
   * valor rejeitado.
   */
  @ExceptionHandler(HandlerMethodValidationException.class)
  public ResponseEntity<ErrorResponse> handleParameterValidation(
      HandlerMethodValidationException ex, HttpServletRequest request) {
    String parametros =
        ex.getParameterValidationResults().stream()
            .map(resultado -> resultado.getMethodParameter().getParameterName())
            .filter(Objects::nonNull)
            .distinct()
            .collect(Collectors.joining(", "));
    return buildResponse(HttpStatus.BAD_REQUEST, mensagemParametro(parametros), request);
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ErrorResponse> handleConstraintViolation(
      ConstraintViolationException ex, HttpServletRequest request) {
    String parametros =
        ex.getConstraintViolations().stream()
            .map(violacao -> nomeDoParametro(violacao.getPropertyPath().toString()))
            .distinct()
            .collect(Collectors.joining(", "));
    return buildResponse(HttpStatus.BAD_REQUEST, mensagemParametro(parametros), request);
  }

  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  public ResponseEntity<ErrorResponse> handleTypeMismatch(
      MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
    return buildResponse(HttpStatus.BAD_REQUEST, mensagemParametro(ex.getName()), request);
  }

  /**
   * Rota inexistente (ADR-017). Mensagem fixa; nada e logado, porque a query string pode carregar
   * dado pessoal e rota inexistente nao e erro da aplicacao.
   */
  @ExceptionHandler({NoResourceFoundException.class, NoHandlerFoundException.class})
  public ResponseEntity<ErrorResponse> handleNotFound(Exception ex, HttpServletRequest request) {
    return buildResponse(HttpStatus.NOT_FOUND, "Recurso nao encontrado", request);
  }

  /** Metodo HTTP nao suportado na rota: 405 com o cabecalho {@code Allow}, sem log (ver 404). */
  @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
  public ResponseEntity<ErrorResponse> handleMethodNotSupported(
      HttpRequestMethodNotSupportedException ex, HttpServletRequest request) {
    ResponseEntity<ErrorResponse> resposta =
        buildResponse(HttpStatus.METHOD_NOT_ALLOWED, "Metodo nao permitido", request);
    Set<HttpMethod> permitidos = ex.getSupportedHttpMethods();
    if (permitidos == null || permitidos.isEmpty()) {
      return resposta;
    }
    return ResponseEntity.status(resposta.getStatusCode())
        .allow(permitidos.toArray(HttpMethod[]::new))
        .body(resposta.getBody());
  }

  /**
   * Erro inesperado: resposta com mensagem fixa. O log leva so a classe da excecao e o caminho sem
   * query string; nunca {@code getMessage()} nem a pilha, porque o MySQL poe o valor do dado
   * pessoal na mensagem (politica de dados do cliente, secao 7).
   */
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleUnexpected(Exception ex, HttpServletRequest request) {
    LOG.error(
        "Erro inesperado excecao={} path={}", ex.getClass().getName(), request.getRequestURI());
    return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno inesperado", request);
  }

  private static String mensagemParametro(String parametros) {
    return parametros.isBlank() ? "Parametro invalido" : "Parametro invalido: " + parametros;
  }

  private static String nomeDoParametro(String caminho) {
    return caminho.substring(caminho.lastIndexOf('.') + 1);
  }

  private ResponseEntity<ErrorResponse> buildResponse(
      HttpStatus status, String mensagem, HttpServletRequest request) {
    ErrorResponse body =
        new ErrorResponse(
            OffsetDateTime.now(),
            status.value(),
            status.getReasonPhrase(),
            mensagem,
            request.getRequestURI());
    return ResponseEntity.status(status).body(body);
  }
}
