package br.com.mecanicasaojorge.api.controller;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.com.mecanicasaojorge.api.config.ClockConfig;
import br.com.mecanicasaojorge.api.dto.VeiculoDetalheResponse;
import br.com.mecanicasaojorge.api.dto.VeiculoListResponse;
import br.com.mecanicasaojorge.api.dto.VeiculoRequest;
import br.com.mecanicasaojorge.api.dto.VeiculoResponse;
import br.com.mecanicasaojorge.api.exception.ClienteNaoEncontradoException;
import br.com.mecanicasaojorge.api.exception.PlacaJaCadastradaException;
import br.com.mecanicasaojorge.api.exception.VeiculoNaoEncontradoException;
import br.com.mecanicasaojorge.api.security.JwtConfig;
import br.com.mecanicasaojorge.api.security.RestAuthenticationEntryPoint;
import br.com.mecanicasaojorge.api.security.SecurityConfig;
import br.com.mecanicasaojorge.api.service.VeiculoService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

/** As quatro rotas de veiculo na camada web (F04): contrato HTTP com o service simulado. */
@WebMvcTest(controllers = VeiculoController.class)
@Import({
  SecurityConfig.class,
  JwtConfig.class,
  RestAuthenticationEntryPoint.class,
  ClockConfig.class
})
@EnableConfigurationProperties(br.com.mecanicasaojorge.api.config.JwtProperties.class)
@TestPropertySource(
    properties = {"jwt.secret=01234567890123456789012345678901", "jwt.expiration-minutes=10080"})
class VeiculoControllerTest {

  private static final String POR_CLIENTE = "/api/v1/clientes/4/veiculos";
  private static final String POR_ID = "/api/v1/veiculos/9";
  private static final String CORPO =
      "{\"placa\":\"abc-1d23\",\"marca\":\"Fiat\",\"modelo\":\"Uno\",\"ano\":2015,\"cor\":\"Prata\"}";

  @Autowired private MockMvc mockMvc;

  @MockitoBean private VeiculoService veiculoService;

  @Test
  void shouldReturn201WithLocationAndNormalizedPlateWhenRequestIsValid() throws Exception {
    given(veiculoService.criar(eq(4L), any(VeiculoRequest.class), eq("7")))
        .willReturn(new VeiculoResponse(9L, 4L, "ABC1D23", "Fiat", "Uno", 2015, "Prata"));

    mockMvc
        .perform(
            post(POR_CLIENTE)
                .with(jwt().jwt(j -> j.subject("7")))
                .contentType(MediaType.APPLICATION_JSON)
                .content(CORPO))
        .andExpect(status().isCreated())
        .andExpect(header().string("Location", POR_ID))
        .andExpect(header().string("Cache-Control", containsString("no-store")))
        .andExpect(jsonPath("$.clienteId").value(4))
        .andExpect(jsonPath("$.placa").value("ABC1D23"));
  }

  @Test
  void shouldPassNormalizedPlateToServiceWhenPlateIsTypedWithMask() throws Exception {
    given(veiculoService.criar(eq(4L), any(VeiculoRequest.class), any()))
        .willAnswer(
            inv -> {
              VeiculoRequest r = inv.getArgument(1);
              return new VeiculoResponse(9L, 4L, r.placa(), "Fiat", "Uno", 2015, null);
            });

    mockMvc
        .perform(
            post(POR_CLIENTE).with(jwt()).contentType(MediaType.APPLICATION_JSON).content(CORPO))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.placa").value("ABC1D23"));
  }

  @Test
  void shouldReturn400WithOneErrorPerFieldAndNoRejectedValueWhenBodyIsInvalid() throws Exception {
    mockMvc
        .perform(
            post(POR_CLIENTE)
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"placa\":\"AB12345\",\"marca\":\" \",\"modelo\":\"Uno\",\"ano\":1899}"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.erros.length()").value(3))
        .andExpect(jsonPath("$.erros[?(@.campo=='placa')].chave").value("veiculo.form.placa.erro"))
        .andExpect(
            jsonPath("$.erros[?(@.campo=='marca')].chave").value("veiculo.form.marca.obrigatoria"))
        .andExpect(jsonPath("$.erros[?(@.campo=='ano')].chave").value("veiculo.form.ano.faixa"))
        .andExpect(content().string(not(containsString("AB12345"))))
        .andExpect(content().string(not(containsString("1899"))));

    verifyNoInteractions(veiculoService);
  }

  @Test
  void shouldReturn400WithoutCallingServiceWhenBodyIsMalformedOrYearIsNotNumber() throws Exception {
    mockMvc
        .perform(post(POR_CLIENTE).with(jwt()).contentType(MediaType.APPLICATION_JSON).content("{"))
        .andExpect(status().isBadRequest());
    mockMvc
        .perform(
            post(POR_CLIENTE)
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"placa\":\"ABC1D23\",\"ano\":\"abc\"}"))
        .andExpect(status().isBadRequest())
        .andExpect(content().string(not(containsString("abc"))));

    verifyNoInteractions(veiculoService);
  }

  @Test
  void shouldReturn409WithFixedMessageAndPlateKeyWhenServiceReportsRepeatedPlate()
      throws Exception {
    given(veiculoService.criar(any(), any(VeiculoRequest.class), any()))
        .willThrow(new PlacaJaCadastradaException());

    mockMvc
        .perform(
            post(POR_CLIENTE).with(jwt()).contentType(MediaType.APPLICATION_JSON).content(CORPO))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.mensagem").value("Placa ja cadastrada"))
        .andExpect(jsonPath("$.erros[0].campo").value("placa"))
        .andExpect(jsonPath("$.erros[0].chave").value("veiculo.form.placa.duplicada"))
        .andExpect(content().string(not(containsString("ABC1D23"))));
  }

  @Test
  void shouldReturn404WhenCreatingForMissingClient() throws Exception {
    given(veiculoService.criar(any(), any(VeiculoRequest.class), any()))
        .willThrow(new ClienteNaoEncontradoException());

    mockMvc
        .perform(
            post(POR_CLIENTE).with(jwt()).contentType(MediaType.APPLICATION_JSON).content(CORPO))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.mensagem").value("Cliente nao encontrado"));
  }

  @Test
  void shouldReturn415WhenContentTypeIsNotJson() throws Exception {
    mockMvc
        .perform(post(POR_CLIENTE).with(jwt()).contentType(MediaType.TEXT_PLAIN).content(CORPO))
        .andExpect(status().isUnsupportedMediaType());

    verifyNoInteractions(veiculoService);
  }

  @Test
  void shouldReturn200WithUpdatedVehicleWhenEditing() throws Exception {
    given(veiculoService.editar(eq(9L), any(VeiculoRequest.class), eq("7")))
        .willReturn(new VeiculoResponse(9L, 4L, "ABC1D23", "Fiat", "Uno", 2015, "Prata"));

    mockMvc
        .perform(
            put(POR_ID)
                .with(jwt().jwt(j -> j.subject("7")))
                .contentType(MediaType.APPLICATION_JSON)
                .content(CORPO))
        .andExpect(status().isOk())
        .andExpect(header().string("Cache-Control", containsString("no-store")))
        .andExpect(jsonPath("$.clienteId").value(4));
  }

  @Test
  void shouldIgnoreOwnerAndIdentityFieldsSentInEditBody() throws Exception {
    given(veiculoService.editar(eq(9L), any(VeiculoRequest.class), any()))
        .willReturn(new VeiculoResponse(9L, 4L, "ABC1D23", "Fiat", "Uno", 2015, null));

    mockMvc
        .perform(
            put(POR_ID)
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    "{\"placa\":\"ABC1D23\",\"marca\":\"Fiat\",\"modelo\":\"Uno\",\"ano\":2015,"
                        + "\"clienteId\":77,\"id\":1,\"cliente\":{\"id\":77},\"quilometragem\":1}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.clienteId").value(4));
  }

  @Test
  void shouldReturn404And409OnEditWhenServiceReportsThem() throws Exception {
    given(veiculoService.editar(eq(9L), any(VeiculoRequest.class), any()))
        .willThrow(new VeiculoNaoEncontradoException())
        .willThrow(new PlacaJaCadastradaException());

    mockMvc
        .perform(put(POR_ID).with(jwt()).contentType(MediaType.APPLICATION_JSON).content(CORPO))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.mensagem").value("Veiculo nao encontrado"));
    mockMvc
        .perform(put(POR_ID).with(jwt()).contentType(MediaType.APPLICATION_JSON).content(CORPO))
        .andExpect(status().isConflict());
  }

  @Test
  void shouldReturn200WithEmptyHistoryWhenDetailingVehicle() throws Exception {
    given(veiculoService.detalhar(eq(9L), eq("7")))
        .willReturn(
            new VeiculoDetalheResponse(
                9L, 4L, "Ana Exemplo", "ABC1D23", "Fiat", "Uno", 2015, null, List.of()));

    mockMvc
        .perform(get(POR_ID).with(jwt().jwt(j -> j.subject("7"))))
        .andExpect(status().isOk())
        .andExpect(header().string("Cache-Control", containsString("no-store")))
        .andExpect(jsonPath("$.historicoOs").isArray())
        .andExpect(jsonPath("$.historicoOs.length()").value(0))
        .andExpect(jsonPath("$.clienteNome").value("Ana Exemplo"))
        .andExpect(jsonPath("$.cor").doesNotExist());
  }

  @Test
  void shouldReturn404WhenDetailingMissingVehicle() throws Exception {
    given(veiculoService.detalhar(eq(9L), any())).willThrow(new VeiculoNaoEncontradoException());

    mockMvc
        .perform(get(POR_ID).with(jwt()))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.mensagem").value("Veiculo nao encontrado"));
  }

  @Test
  void shouldReturn400WithoutCallingServiceWhenIdIsNotPositiveNumber() throws Exception {
    for (String id : new String[] {"abc", "0", "-1"}) {
      mockMvc.perform(get("/api/v1/veiculos/" + id).with(jwt())).andExpect(status().isBadRequest());
      mockMvc
          .perform(get("/api/v1/clientes/" + id + "/veiculos").with(jwt()))
          .andExpect(status().isBadRequest());
    }

    verifyNoInteractions(veiculoService);
  }

  @Test
  void shouldReturn200WithArrayWhenListingClientVehicles() throws Exception {
    given(veiculoService.listarPorCliente(eq(4L), eq("7")))
        .willReturn(
            List.of(
                new VeiculoListResponse(1L, "ABC1234", "Fiat", "Uno"),
                new VeiculoListResponse(2L, "ABC1D23", "VW", "Gol")));

    mockMvc
        .perform(get(POR_CLIENTE).with(jwt().jwt(j -> j.subject("7"))))
        .andExpect(status().isOk())
        .andExpect(header().string("Cache-Control", containsString("no-store")))
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(jsonPath("$[0].placa").value("ABC1234"))
        .andExpect(jsonPath("$[1].modelo").value("Gol"));
  }

  @Test
  void shouldReturnEmptyArrayWhenClientHasNoVehiclesAnd404WhenClientIsMissing() throws Exception {
    given(veiculoService.listarPorCliente(eq(4L), any())).willReturn(List.of());
    given(veiculoService.listarPorCliente(eq(5L), any()))
        .willThrow(new ClienteNaoEncontradoException());

    mockMvc
        .perform(get(POR_CLIENTE).with(jwt()))
        .andExpect(status().isOk())
        .andExpect(content().json("[]"));
    mockMvc
        .perform(get("/api/v1/clientes/5/veiculos").with(jwt()))
        .andExpect(status().isNotFound());
  }

  @Test
  void shouldReturn401WithoutCallingServiceOnAllFourRoutesWhenTokenIsMissing() throws Exception {
    mockMvc
        .perform(post(POR_CLIENTE).contentType(MediaType.APPLICATION_JSON).content(CORPO))
        .andExpect(status().isUnauthorized());
    mockMvc
        .perform(put(POR_ID).contentType(MediaType.APPLICATION_JSON).content(CORPO))
        .andExpect(status().isUnauthorized());
    mockMvc.perform(get(POR_ID)).andExpect(status().isUnauthorized());
    mockMvc.perform(get(POR_CLIENTE)).andExpect(status().isUnauthorized());

    verifyNoInteractions(veiculoService);
  }
}
