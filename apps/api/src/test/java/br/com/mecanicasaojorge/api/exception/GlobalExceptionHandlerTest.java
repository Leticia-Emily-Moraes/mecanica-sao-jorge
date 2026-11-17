package br.com.mecanicasaojorge.api.exception;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@ExtendWith(MockitoExtension.class)
class GlobalExceptionHandlerTest {

  private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

  @Mock private HttpServletRequest request;

  private static final class ErroDeExemplo extends AppError {
    ErroDeExemplo(String mensagem) {
      super("EXEMPLO_001", mensagem);
    }
  }

  @Test
  void shouldReturnUnprocessableEntityWithStandardBodyWhenAppErrorIsThrown() {
    when(request.getRequestURI()).thenReturn("/api/v1/exemplo");
    AppError erro = new ErroDeExemplo("falha de exemplo");

    ResponseEntity<ErrorResponse> response = handler.handleAppError(erro, request);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY);
    assertThat(response.getBody()).isNotNull();
    assertThat(response.getBody().mensagem()).isEqualTo("falha de exemplo");
    assertThat(response.getBody().erro())
        .isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase());
    assertThat(response.getBody().path()).isEqualTo("/api/v1/exemplo");
    assertThat(response.getBody().timestamp()).isNotNull();
  }

  @Test
  void shouldReturnNotFoundWithFixedMessageWhenDomainResourceDoesNotExist() {
    when(request.getRequestURI()).thenReturn("/api/v1/clientes/999999");

    ResponseEntity<ErrorResponse> response =
        handler.handleRecursoNaoEncontrado(new ClienteNaoEncontradoException(), request);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    assertThat(response.getBody()).isNotNull();
    assertThat(response.getBody().status()).isEqualTo(404);
    assertThat(response.getBody().erro()).isEqualTo("Not Found");
    assertThat(response.getBody().mensagem()).isEqualTo("Cliente nao encontrado");
    assertThat(response.getBody().path()).isEqualTo("/api/v1/clientes/999999");
    assertThat(response.getBody().timestamp()).isNotNull();
  }

  @Test
  void shouldPickMoreSpecificHandlerWhenDomainNotFoundIsAlsoAnAppError() throws Exception {
    var resolver =
        new org.springframework.web.method.annotation.ExceptionHandlerMethodResolver(
            GlobalExceptionHandler.class);

    assertThat(resolver.resolveMethodByThrowable(new ClienteNaoEncontradoException()).getName())
        .isEqualTo("handleRecursoNaoEncontrado");
    assertThat(resolver.resolveMethodByThrowable(new ErroDeExemplo("x")).getName())
        .isEqualTo("handleAppError");
    assertThat(resolver.resolveMethodByThrowable(new CredenciaisInvalidasException()).getName())
        .isEqualTo("handleCredenciaisInvalidas");
    assertThat(resolver.resolveMethodByThrowable(new java.util.NoSuchElementException()).getName())
        .isEqualTo("handleUnexpected");
  }

  @Test
  void shouldReturnNotFoundWithFixedMessageWhenResourceDoesNotExist() {
    when(request.getRequestURI()).thenReturn("/api/v1/rota-inexistente");

    ResponseEntity<ErrorResponse> response =
        handler.handleNotFound(
            new NoResourceFoundException(
                HttpMethod.GET, "/api/v1/rota-inexistente", "api/v1/rota-inexistente"),
            request);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    assertThat(response.getBody()).isNotNull();
    assertThat(response.getBody().erro()).isEqualTo("Not Found");
    assertThat(response.getBody().mensagem()).isEqualTo("Recurso nao encontrado");
    assertThat(response.getBody().path()).isEqualTo("/api/v1/rota-inexistente");
  }

  @Test
  void shouldReturnMethodNotAllowedWithAllowHeaderWhenMethodIsNotSupported() {
    when(request.getRequestURI()).thenReturn("/api/v1/clientes");

    ResponseEntity<ErrorResponse> response =
        handler.handleMethodNotSupported(
            new HttpRequestMethodNotSupportedException("DELETE", List.of("GET")), request);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.METHOD_NOT_ALLOWED);
    assertThat(response.getHeaders().getAllow()).contains(HttpMethod.GET);
    assertThat(response.getBody()).isNotNull();
    assertThat(response.getBody().erro()).isEqualTo("Method Not Allowed");
    assertThat(response.getBody().mensagem()).isEqualTo("Metodo nao permitido");
    assertThat(response.getBody().path()).isEqualTo("/api/v1/clientes");
  }

  @Test
  void shouldReturnInternalServerErrorWithoutLeakingDetailsWhenUnexpectedExceptionIsThrown() {
    when(request.getRequestURI()).thenReturn("/api/v1/exemplo");

    ResponseEntity<ErrorResponse> response =
        handler.handleUnexpected(new RuntimeException("stacktrace sensivel"), request);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    assertThat(response.getBody()).isNotNull();
    assertThat(response.getBody().mensagem()).isEqualTo("Erro interno inesperado");
  }
}
