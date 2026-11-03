package br.com.mecanicasaojorge.api.exception;

import jakarta.servlet.http.HttpServletRequest;
import java.time.OffsetDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Handler global de erros (ADR-011). Converte excecoes internas no formato publico padronizado;
 * detalhes de stack trace nunca chegam ao cliente.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

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
    return buildResponse(HttpStatus.UNPROCESSABLE_ENTITY, mensagem, request);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleUnexpected(Exception ex, HttpServletRequest request) {
    return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno inesperado", request);
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
