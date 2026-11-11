package br.com.mecanicasaojorge.api.dto;

import java.time.Instant;

/** Corpo de saida do login (overview.md, contrato de API). Nunca inclui senha/senha_hash. */
public record LoginResponse(String token, String tipo, Instant expiraEm, UsuarioResumo usuario) {}
