package br.com.mecanicasaojorge.api.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.PessimisticLockingFailureException;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.validation.method.ParameterErrors;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingPathVariableException;
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

  static final String MENSAGEM_GRAVACAO_SIMULTANEA =
      "Conflito de gravacao simultanea, tente novamente";

  /** Chave i18n: segmentos alfabeticos separados por ponto, ex.: veiculo.form.placa.erro. */
  private static final Pattern FORMATO_CHAVE = Pattern.compile("^[a-z]+(\\.[a-zA-Z]+)+$");

  @ExceptionHandler(CredenciaisInvalidasException.class)
  public ResponseEntity<ErrorResponse> handleCredenciaisInvalidas(
      CredenciaisInvalidasException ex, HttpServletRequest request) {
    return buildResponse(HttpStatus.UNAUTHORIZED, ex.getMessage(), request);
  }

  /** Recurso de dominio inexistente (ADR-019): mensagem fixa da subclasse, sem log. */
  @ExceptionHandler(RecursoNaoEncontradoException.class)
  public ResponseEntity<ErrorResponse> handleRecursoNaoEncontrado(
      RecursoNaoEncontradoException ex, HttpServletRequest request) {
    return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request);
  }

  /** Conflito de estado (ADR-020): mensagem fixa da subclasse, sem causa e sem log. */
  @ExceptionHandler(ConflitoException.class)
  public ResponseEntity<ErrorResponse> handleConflito(
      ConflitoException ex, HttpServletRequest request) {
    return buildResponse(HttpStatus.CONFLICT, ex.getMessage(), request, ex.getErros());
  }

  /**
   * Deadlock ou espera de lock na corrida de gravacao (ADR-027): 409 com mensagem fixa, sem ler a
   * excecao e sem log, porque a mensagem do driver pode citar a consulta e o valor.
   */
  @ExceptionHandler(PessimisticLockingFailureException.class)
  public ResponseEntity<ErrorResponse> handleGravacaoSimultanea(
      PessimisticLockingFailureException ex, HttpServletRequest request) {
    return buildResponse(HttpStatus.CONFLICT, MENSAGEM_GRAVACAO_SIMULTANEA, request);
  }

  @ExceptionHandler(AppError.class)
  public ResponseEntity<ErrorResponse> handleAppError(AppError ex, HttpServletRequest request) {
    return buildResponse(HttpStatus.UNPROCESSABLE_ENTITY, ex.getMessage(), request);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidation(
      MethodArgumentNotValidException ex, HttpServletRequest request) {
    List<FieldError> campos = ex.getBindingResult().getFieldErrors();
    return buildResponse(
        HttpStatus.BAD_REQUEST, juntarMensagens(campos), request, errosDeCampo(campos));
  }

  /**
   * Um {@link ErroCampo} por erro, ordenado por campo e chave (resposta deterministica). O nome do
   * campo vem do DTO ({@code getField()}), a chave so existe se a mensagem tiver formato de chave
   * (ADR-023) e o valor rejeitado nunca entra.
   */
  private static List<ErroCampo> errosDeCampo(List<FieldError> campos) {
    return campos.stream()
        .map(erro -> new ErroCampo(erro.getField(), chaveOuNula(erro.getDefaultMessage())))
        .sorted(
            Comparator.comparing(ErroCampo::campo)
                .thenComparing(ErroCampo::chave, Comparator.nullsFirst(Comparator.naturalOrder())))
        .toList();
  }

  private static String chaveOuNula(String mensagem) {
    return mensagem != null && FORMATO_CHAVE.matcher(mensagem).matches() ? mensagem : null;
  }

  /**
   * JSON malformado, corpo ausente ou tipo errado de campo (achado E2). Mensagem fixa: a do Jackson
   * cita trecho do corpo, que pode ter dado pessoal.
   */
  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ErrorResponse> handleUnreadableBody(
      HttpMessageNotReadableException ex, HttpServletRequest request) {
    return buildResponse(HttpStatus.BAD_REQUEST, "Corpo da requisicao invalido", request);
  }

  /** Content-Type diferente de JSON (achado E2): 415 com mensagem fixa. */
  @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
  public ResponseEntity<ErrorResponse> handleUnsupportedMediaType(
      HttpMediaTypeNotSupportedException ex, HttpServletRequest request) {
    return buildResponse(
        HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Tipo de conteudo nao suportado", request);
  }

  /**
   * Validacao de parametro de rota/query (ADR-017). A mensagem cita so o nome do parametro, nunca o
   * valor rejeitado.
   */
  @ExceptionHandler(HandlerMethodValidationException.class)
  public ResponseEntity<ErrorResponse> handleParameterValidation(
      HandlerMethodValidationException ex, HttpServletRequest request) {
    List<FieldError> camposDoCorpo =
        ex.getParameterValidationResults().stream()
            .filter(ParameterErrors.class::isInstance)
            .map(ParameterErrors.class::cast)
            .flatMap(erros -> erros.getFieldErrors().stream())
            .toList();
    String parametros =
        ex.getParameterValidationResults().stream()
            .filter(resultado -> !(resultado instanceof ParameterErrors))
            .map(resultado -> resultado.getMethodParameter().getParameterName())
            .filter(Objects::nonNull)
            .distinct()
            .collect(Collectors.joining(", "));
    if (camposDoCorpo.isEmpty()) {
      return buildResponse(HttpStatus.BAD_REQUEST, mensagemParametro(parametros), request);
    }
    // Corpo @Valid junto de parametro validado (ex.: @Positive no id): o Spring 7 entrega o erro do
    // corpo por aqui, e nao por MethodArgumentNotValidException. Mesmo formato do 400 de corpo.
    String mensagem = juntarMensagens(camposDoCorpo);
    if (!parametros.isBlank()) {
      mensagem += "; " + mensagemParametro(parametros);
    }
    return buildResponse(HttpStatus.BAD_REQUEST, mensagem, request, errosDeCampo(camposDoCorpo));
  }

  private static String juntarMensagens(List<FieldError> campos) {
    return campos.stream()
        .map(FieldError::getDefaultMessage)
        .reduce((primeira, segunda) -> primeira + "; " + segunda)
        .orElse("Dados invalidos");
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
   * Variavel de rota vazia ou so com espacos (ex.: {@code /clientes/%20}): o Spring converte para
   * {@code null} e sinaliza ausencia da variavel apos a conversao. E entrada invalida do cliente,
   * logo 400 (F-1). Sem conversao, a variavel falta no mapeamento da rota: defeito do servidor, que
   * segue como erro inesperado (500 com log).
   */
  @ExceptionHandler(MissingPathVariableException.class)
  public ResponseEntity<ErrorResponse> handleMissingPathVariable(
      MissingPathVariableException ex, HttpServletRequest request) {
    if (!ex.isMissingAfterConversion()) {
      return handleUnexpected(ex, request);
    }
    return buildResponse(HttpStatus.BAD_REQUEST, mensagemParametro(ex.getVariableName()), request);
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
    return buildResponse(status, mensagem, request, List.of());
  }

  private ResponseEntity<ErrorResponse> buildResponse(
      HttpStatus status, String mensagem, HttpServletRequest request, List<ErroCampo> erros) {
    ErrorResponse body =
        new ErrorResponse(
            OffsetDateTime.now(),
            status.value(),
            status.getReasonPhrase(),
            mensagem,
            request.getRequestURI(),
            erros);
    return ResponseEntity.status(status).body(body);
  }
}
