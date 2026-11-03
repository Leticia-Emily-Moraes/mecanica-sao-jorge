package br.com.mecanicasaojorge.api.exception;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

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
  void shouldReturnInternalServerErrorWithoutLeakingDetailsWhenUnexpectedExceptionIsThrown() {
    when(request.getRequestURI()).thenReturn("/api/v1/exemplo");

    ResponseEntity<ErrorResponse> response =
        handler.handleUnexpected(new RuntimeException("stacktrace sensivel"), request);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    assertThat(response.getBody()).isNotNull();
    assertThat(response.getBody().mensagem()).isEqualTo("Erro interno inesperado");
  }
}
