package br.com.mecanicasaojorge.api.dto;

import br.com.mecanicasaojorge.api.entity.Perfil;

/** Dados publicos do usuario autenticado, sem {@code senha_hash} (ADR-007). */
public record UsuarioResumo(Long id, String nome, String email, Perfil perfil) {}
