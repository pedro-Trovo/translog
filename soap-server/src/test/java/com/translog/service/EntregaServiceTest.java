package com.translog.service;

import com.translog.entity.Entrega;
import com.translog.entity.StatusEntrega;
import com.translog.entity.StatusHistorico;
import com.translog.repository.EntregaRepository;
import com.translog.repository.StatusHistoricoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class EntregaServiceTest {

    @Autowired
    private EntregaService entregaService;

    @Autowired
    private EntregaRepository entregaRepository;

    @Autowired
    private StatusHistoricoRepository statusHistoricoRepository;

    @BeforeEach
    void setUp() {
        statusHistoricoRepository.deleteAll();
        entregaRepository.deleteAll();
    }

    @Test
    @DisplayName("Deve criar entrega com codigo de rastreio e status COLETADO")
    void deveCriarEntrega() {
        Entrega entrega = entregaService.criarEntrega(
                "Joao Silva", "Sao Paulo",
                "Maria Souza", "Rio de Janeiro",
                "Rua das Flores, 123", 2.5);

        assertNotNull(entrega.getId());
        assertNotNull(entrega.getCodigoRastreio());
        assertTrue(entrega.getCodigoRastreio().startsWith("TL-"));
        assertEquals(StatusEntrega.COLETADO, entrega.getStatusAtual());
        assertEquals("Joao Silva", entrega.getRemetenteNome());

        List<StatusHistorico> historico = statusHistoricoRepository.findByEntregaIdOrderByRegistradoEmDesc(entrega.getId());
        assertEquals(1, historico.size());
        assertEquals(StatusEntrega.COLETADO, historico.get(0).getStatus());
    }

    @Test
    @DisplayName("Deve rastrear entrega pelo codigo")
    void deveRastrearEntrega() {
        Entrega criada = entregaService.criarEntrega(
                "Joao", "SP", "Maria", "RJ",
                "Rua A, 123", 1.0);

        Optional<Entrega> resultado = entregaService.rastrearEntrega(criada.getCodigoRastreio());

        assertTrue(resultado.isPresent());
        assertEquals(criada.getId(), resultado.get().getId());
    }

    @Test
    @DisplayName("Deve retornar empty ao rastrear codigo inexistente")
    void deveRetornarVazioParaCodigoInexistente() {
        Optional<Entrega> resultado = entregaService.rastrearEntrega("TL-00000000-0000");
        assertFalse(resultado.isPresent());
    }

    @Test
    @DisplayName("Deve atualizar status seguindo fluxo valido")
    void deveAtualizarStatus() {
        Entrega entrega = entregaService.criarEntrega(
                "Joao", "SP", "Maria", "RJ",
                "Rua A, 123", 1.0);

        entregaService.atualizarStatus(entrega.getCodigoRastreio(), StatusEntrega.EM_TRANSITO, "Saiu para transporte");
        Optional<Entrega> atualizada = entregaService.rastrearEntrega(entrega.getCodigoRastreio());

        assertTrue(atualizada.isPresent());
        assertEquals(StatusEntrega.EM_TRANSITO, atualizada.get().getStatusAtual());

        List<StatusHistorico> historico = statusHistoricoRepository.findByEntregaIdOrderByRegistradoEmDesc(atualizada.get().getId());
        assertEquals(2, historico.size());
        assertEquals(StatusEntrega.EM_TRANSITO, historico.get(0).getStatus());
    }

    @Test
    @DisplayName("Deve lancar erro ao tentar transicao invalida")
    void deveRejeitarTransicaoInvalida() {
        Entrega entrega = entregaService.criarEntrega(
                "Joao", "SP", "Maria", "RJ",
                "Rua A, 123", 1.0);

        assertThrows(IllegalArgumentException.class, () ->
                entregaService.atualizarStatus(entrega.getCodigoRastreio(), StatusEntrega.ENTREGUE, "Pulou etapas"));
    }

    @Test
    @DisplayName("Deve cancelar entrega que nao esteja ENTREGUE")
    void deveCancelarEntrega() {
        Entrega entrega = entregaService.criarEntrega(
                "Joao", "SP", "Maria", "RJ",
                "Rua A, 123", 1.0);

        entregaService.atualizarStatus(entrega.getCodigoRastreio(), StatusEntrega.EM_TRANSITO, null);
        entregaService.atualizarStatus(entrega.getCodigoRastreio(), StatusEntrega.SAIU_PARA_ENTREGA, null);
        entregaService.atualizarStatus(entrega.getCodigoRastreio(), StatusEntrega.TENTATIVA_FALHA, "Ninguem em casa");

        Optional<Entrega> cancelada = entregaService.cancelarEntrega(entrega.getCodigoRastreio(), "Cliente desistiu");
        assertTrue(cancelada.isPresent());
        assertEquals(StatusEntrega.CANCELADO, cancelada.get().getStatusAtual());
    }

    @Test
    @DisplayName("Nao deve cancelar entrega ja entregue")
    void naoDeveCancelarEntregaEntregue() {
        Entrega entrega = entregaService.criarEntrega(
                "Joao", "SP", "Maria", "RJ",
                "Rua A, 123", 1.0);

        entregaService.atualizarStatus(entrega.getCodigoRastreio(), StatusEntrega.EM_TRANSITO, null);
        entregaService.atualizarStatus(entrega.getCodigoRastreio(), StatusEntrega.SAIU_PARA_ENTREGA, null);
        entregaService.atualizarStatus(entrega.getCodigoRastreio(), StatusEntrega.ENTREGUE, "Entregue ao porteiro");

        assertThrows(IllegalStateException.class, () ->
                entregaService.cancelarEntrega(entrega.getCodigoRastreio(), "Motivo qualquer"));
    }

    @Test
    @DisplayName("Deve listar entregas com filtro de data")
    void deveListarComFiltroData() {
        entregaService.criarEntrega("A", "SP", "B", "RJ", "Rua 1", 1.0);
        entregaService.criarEntrega("C", "SP", "D", "RJ", "Rua 2", 2.0);

        List<Entrega> entregas = entregaService.listarEntregas(null, null, null);
        assertEquals(2, entregas.size());
    }

    @Test
    @DisplayName("Deve listar entregas com filtro de status")
    void deveListarComFiltroStatus() {
        Entrega e1 = entregaService.criarEntrega("A", "SP", "B", "RJ", "Rua 1", 1.0);
        entregaService.criarEntrega("C", "SP", "D", "RJ", "Rua 2", 2.0);

        entregaService.atualizarStatus(e1.getCodigoRastreio(), StatusEntrega.EM_TRANSITO, null);

        List<Entrega> coletados = entregaService.listarEntregas(null, null, StatusEntrega.COLETADO);
        assertEquals(1, coletados.size());

        List<Entrega> emTransito = entregaService.listarEntregas(null, null, StatusEntrega.EM_TRANSITO);
        assertEquals(1, emTransito.size());
    }

    @Test
    @DisplayName("Deve gerar codigos de rastreio sequenciais")
    void deveGerarCodigosSequenciais() {
        Entrega e1 = entregaService.criarEntrega("A", "SP", "B", "RJ", "Rua 1", 1.0);
        Entrega e2 = entregaService.criarEntrega("C", "SP", "D", "RJ", "Rua 2", 2.0);

        String codigo1 = e1.getCodigoRastreio();
        String codigo2 = e2.getCodigoRastreio();

        assertTrue(codigo1.matches("TL-\\d{8}-\\d{4}"));
        assertTrue(codigo2.matches("TL-\\d{8}-\\d{4}"));

        String prefixo = codigo1.substring(0, 13);
        assertTrue(codigo2.startsWith(prefixo));

        int seq1 = Integer.parseInt(codigo1.substring(14));
        int seq2 = Integer.parseInt(codigo2.substring(14));
        assertEquals(seq1 + 1, seq2);
    }
}
