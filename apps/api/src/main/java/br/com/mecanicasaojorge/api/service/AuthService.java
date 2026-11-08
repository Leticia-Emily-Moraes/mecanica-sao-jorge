package br.com.mecanicasaojorge.api.service;

import br.com.mecanicasaojorge.api.config.JwtProperties;
import br.com.mecanicasaojorge.api.dto.LoginRequest;
import br.com.mecanicasaojorge.api.dto.LoginResponse;
import br.com.mecanicasaojorge.api.entity.Usuario;
import br.com.mecanicasaojorge.api.exception.CredenciaisInvalidasException;
import br.com.mecanicasaojorge.api.mapper.UsuarioMapper;
import br.com.mecanicasaojorge.api.repository.UsuarioRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

/**
 * Regra de negocio do login (ADR-004). Email inexistente, usuario inativo e senha incorreta
 * resultam na mesma {@link CredenciaisInvalidasException}, sem indicar qual caso ocorreu.
 */
@Service
public class AuthService {

  private static final String ISSUER = "mecanica-sao-jorge-api";
  private static final String CLAIM_PERFIL = "perfil";

  /**
   * Hash BCrypt constante, sem correspondencia a nenhuma senha real (gerado sobre valor aleatorio
   * descartado). Usado para comparar a senha mesmo quando o usuario nao existe ou esta inativo,
   * mantendo o tempo de resposta uniforme e impedindo enumeracao de usuario por timing
   * (US-AUTH-01-03). Nao e segredo: nunca valida login algum.
   */
  private static final String DUMMY_HASH =
      "$2b$10$GSKXOnBrjN6WyQJcs/5ltu3V2t9tPafncWkk74zV9PxOPp4Og0PJe";

  private final UsuarioRepository usuarioRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtEncoder jwtEncoder;
  private final JwtProperties jwtProperties;
  private final UsuarioMapper usuarioMapper;

  public AuthService(
      UsuarioRepository usuarioRepository,
      PasswordEncoder passwordEncoder,
      JwtEncoder jwtEncoder,
      JwtProperties jwtProperties,
      UsuarioMapper usuarioMapper) {
    this.usuarioRepository = usuarioRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtEncoder = jwtEncoder;
    this.jwtProperties = jwtProperties;
    this.usuarioMapper = usuarioMapper;
  }

  public LoginResponse login(LoginRequest request) {
    Optional<Usuario> encontrado =
        usuarioRepository.findByEmail(request.email()).filter(Usuario::isAtivo);

    // Executa BCrypt em todos os caminhos — contra o hash real quando o usuario existe e esta
    // ativo, ou contra o DUMMY_HASH quando nao — para que o tempo de resposta nao revele a
    // existencia do email (mitiga enumeracao de usuario por timing, US-AUTH-01-03).
    String hashAlvo = encontrado.map(Usuario::getSenhaHash).orElse(DUMMY_HASH);
    boolean senhaConfere = passwordEncoder.matches(request.senha(), hashAlvo);

    if (encontrado.isEmpty() || !senhaConfere) {
      throw new CredenciaisInvalidasException();
    }

    Usuario usuario = encontrado.get();
    Instant emitidoEm = Instant.now();
    Instant expiraEm = emitidoEm.plus(jwtProperties.expirationMinutes(), ChronoUnit.MINUTES);
    String token = gerarToken(usuario, emitidoEm, expiraEm);

    return new LoginResponse(token, "Bearer", expiraEm, usuarioMapper.toResumo(usuario));
  }

  private String gerarToken(Usuario usuario, Instant emitidoEm, Instant expiraEm) {
    JwtClaimsSet claims =
        JwtClaimsSet.builder()
            .issuer(ISSUER)
            .issuedAt(emitidoEm)
            .expiresAt(expiraEm)
            .subject(String.valueOf(usuario.getId()))
            .claim(CLAIM_PERFIL, usuario.getPerfil().name())
            .build();
    JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
    return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
  }
}
