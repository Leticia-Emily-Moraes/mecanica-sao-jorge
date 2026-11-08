package br.com.mecanicasaojorge.api.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.mecanicasaojorge.api.config.JwtProperties;
import br.com.mecanicasaojorge.api.dto.LoginRequest;
import br.com.mecanicasaojorge.api.dto.LoginResponse;
import br.com.mecanicasaojorge.api.entity.Perfil;
import br.com.mecanicasaojorge.api.entity.Usuario;
import br.com.mecanicasaojorge.api.exception.CredenciaisInvalidasException;
import br.com.mecanicasaojorge.api.mapper.UsuarioMapperImpl;
import br.com.mecanicasaojorge.api.repository.UsuarioRepository;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import javax.crypto.spec.SecretKeySpec;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

/** Regra de negocio do login (ADR-004, US-AUTH-01). */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

  private static final String SECRET = "01234567890123456789012345678901";
  private static final String SENHA_VALIDA = "SenhaForte#1";

  @Mock private UsuarioRepository usuarioRepository;

  private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
  private final SecretKeySpec chave = new SecretKeySpec(SECRET.getBytes(), "HmacSHA256");
  private final JwtEncoder jwtEncoder = new NimbusJwtEncoder(new ImmutableSecret<>(chave));
  private final JwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(chave).build();
  private final JwtProperties jwtProperties = new JwtProperties(SECRET, 10080);

  private AuthService authService;
  private Usuario usuario;

  @BeforeEach
  void setUp() {
    authService =
        new AuthService(
            usuarioRepository, passwordEncoder, jwtEncoder, jwtProperties, new UsuarioMapperImpl());
    usuario =
        Usuario.builder()
            .id(1L)
            .nome("Ana Paula")
            .email("ana.paula@mecanicasaojorge.com.br")
            .senhaHash(passwordEncoder.encode(SENHA_VALIDA))
            .perfil(Perfil.ADMIN)
            .ativo(true)
            .build();
  }

  @Test
  void shouldReturnTokenAndUsuarioWhenCredentialsAreValid() {
    when(usuarioRepository.findByEmail(usuario.getEmail())).thenReturn(Optional.of(usuario));

    LoginResponse response = authService.login(new LoginRequest(usuario.getEmail(), SENHA_VALIDA));

    assertThat(response.token()).isNotBlank();
    assertThat(response.tipo()).isEqualTo("Bearer");
    assertThat(response.usuario().id()).isEqualTo(1L);
    assertThat(response.usuario().nome()).isEqualTo("Ana Paula");
    assertThat(response.usuario().email()).isEqualTo(usuario.getEmail());
    assertThat(response.usuario().perfil()).isEqualTo(Perfil.ADMIN);
  }

  @Test
  void shouldNeverExposeSenhaHashInLoginResponse() {
    when(usuarioRepository.findByEmail(usuario.getEmail())).thenReturn(Optional.of(usuario));

    LoginResponse response = authService.login(new LoginRequest(usuario.getEmail(), SENHA_VALIDA));

    assertThat(response.toString()).doesNotContain(usuario.getSenhaHash());
  }

  @Test
  void shouldEmitJwtWithExpectedClaimsAndSevenDaysExpiration() {
    when(usuarioRepository.findByEmail(usuario.getEmail())).thenReturn(Optional.of(usuario));

    LoginResponse response = authService.login(new LoginRequest(usuario.getEmail(), SENHA_VALIDA));
    Jwt jwt = jwtDecoder.decode(response.token());

    assertThat(jwt.getSubject()).isEqualTo("1");
    assertThat(jwt.getClaimAsString("perfil")).isEqualTo("ADMIN");
    assertThat(jwt.getClaims().get("iss").toString()).contains("mecanica-sao-jorge-api");
    assertThat(Duration.between(jwt.getIssuedAt(), jwt.getExpiresAt()))
        .isEqualTo(Duration.ofDays(7));
    assertThat(jwt.getExpiresAt()).isEqualTo(response.expiraEm().truncatedTo(ChronoUnit.SECONDS));
  }

  @Test
  void shouldThrowCredenciaisInvalidasWhenEmailDoesNotExist() {
    when(usuarioRepository.findByEmail("inexistente@mecanicasaojorge.com.br"))
        .thenReturn(Optional.empty());

    assertThatThrownBy(
            () ->
                authService.login(
                    new LoginRequest("inexistente@mecanicasaojorge.com.br", SENHA_VALIDA)))
        .isInstanceOf(CredenciaisInvalidasException.class)
        .hasMessage("Credenciais inválidas");
  }

  @Test
  void shouldThrowCredenciaisInvalidasWhenPasswordDoesNotMatch() {
    when(usuarioRepository.findByEmail(usuario.getEmail())).thenReturn(Optional.of(usuario));

    assertThatThrownBy(
            () -> authService.login(new LoginRequest(usuario.getEmail(), "senha-errada")))
        .isInstanceOf(CredenciaisInvalidasException.class)
        .hasMessage("Credenciais inválidas");
  }

  @Test
  void shouldThrowCredenciaisInvalidasWhenUsuarioIsInativo() {
    usuario.setAtivo(false);
    when(usuarioRepository.findByEmail(usuario.getEmail())).thenReturn(Optional.of(usuario));

    assertThatThrownBy(() -> authService.login(new LoginRequest(usuario.getEmail(), SENHA_VALIDA)))
        .isInstanceOf(CredenciaisInvalidasException.class);
  }

  @Test
  void shouldRunPasswordCheckEvenWhenEmailDoesNotExistToPreventTimingEnumeration() {
    PasswordEncoder encoderSpy = mock(PasswordEncoder.class);
    when(encoderSpy.matches(anyString(), anyString())).thenReturn(false);
    AuthService service =
        new AuthService(
            usuarioRepository, encoderSpy, jwtEncoder, jwtProperties, new UsuarioMapperImpl());
    when(usuarioRepository.findByEmail("inexistente@mecanicasaojorge.com.br"))
        .thenReturn(Optional.empty());

    assertThatThrownBy(
            () ->
                service.login(
                    new LoginRequest("inexistente@mecanicasaojorge.com.br", SENHA_VALIDA)))
        .isInstanceOf(CredenciaisInvalidasException.class);

    // Mesmo sem usuario, o BCrypt roda contra o hash dummy: tempo uniforme, sem enumeracao.
    verify(encoderSpy).matches(eq(SENHA_VALIDA), anyString());
  }
}
