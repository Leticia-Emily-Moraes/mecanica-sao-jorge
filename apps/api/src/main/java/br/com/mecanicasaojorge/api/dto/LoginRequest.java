package br.com.mecanicasaojorge.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/** Corpo de entrada do login (overview.md, contrato de API). */
public record LoginRequest(
    @NotBlank(message = "email e obrigatorio") @Email(message = "email invalido") String email,
    @NotBlank(message = "senha e obrigatoria") String senha) {}
