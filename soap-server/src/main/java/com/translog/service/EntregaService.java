package com.translog.service;

import com.translog.entity.Entrega;
import com.translog.entity.StatusEntrega;
import com.translog.entity.StatusHistorico;
import com.translog.repository.EntregaRepository;
import com.translog.repository.StatusHistoricoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class EntregaService {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");

    private final EntregaRepository entregaRepository;
    private final StatusHistoricoRepository statusHistoricoRepository;

    public EntregaService(EntregaRepository entregaRepository,
                          StatusHistoricoRepository statusHistoricoRepository) {
        this.entregaRepository = entregaRepository;
        this.statusHistoricoRepository = statusHistoricoRepository;
    }

    @Transactional
    public Entrega criarEntrega(String remetenteNome, String remetenteCidade,
                                String destinatarioNome, String destinatarioCidade,
                                String destinatarioEndereco, Double pesoKg) {
        String codigoRastreio = gerarCodigoRastreio();

        Entrega entrega = Entrega.builder()
                .codigoRastreio(codigoRastreio)
                .remetenteNome(remetenteNome)
                .remetenteCidade(remetenteCidade)
                .destinatarioNome(destinatarioNome)
                .destinatarioCidade(destinatarioCidade)
                .destinatarioEndereco(destinatarioEndereco)
                .pesoKg(pesoKg != null ? BigDecimal.valueOf(pesoKg) : null)
                .statusAtual(StatusEntrega.COLETADO)
                .build();

        entrega = entregaRepository.save(entrega);

        registrarHistorico(entrega, StatusEntrega.COLETADO, "Entrega criada");

        return entrega;
    }

    @Transactional(readOnly = true)
    public Optional<Entrega> rastrearEntrega(String codigoRastreio) {
        return entregaRepository.findByCodigoRastreio(codigoRastreio);
    }

    @Transactional
    public Optional<Entrega> atualizarStatus(String codigoRastreio, StatusEntrega novoStatus, String observacao) {
        Optional<Entrega> opt = entregaRepository.findByCodigoRastreio(codigoRastreio);
        if (opt.isEmpty()) {
            return Optional.empty();
        }

        Entrega entrega = opt.get();

        if (!transicaoValida(entrega.getStatusAtual(), novoStatus)) {
            throw new IllegalArgumentException(
                    "Transicao invalida de " + entrega.getStatusAtual() + " para " + novoStatus);
        }

        entrega.setStatusAtual(novoStatus);
        entrega = entregaRepository.save(entrega);

        registrarHistorico(entrega, novoStatus, observacao);

        return Optional.of(entrega);
    }

    @Transactional(readOnly = true)
    public List<Entrega> listarEntregas(LocalDate dataInicio, LocalDate dataFim, StatusEntrega status) {
        LocalDateTime inicio = dataInicio != null
                ? dataInicio.atStartOfDay()
                : LocalDate.now().atStartOfDay();

        LocalDateTime fim = dataFim != null
                ? dataFim.atTime(LocalTime.MAX)
                : LocalDate.now().atTime(LocalTime.MAX);

        if (status != null) {
            return entregaRepository.findByStatusAtualAndCriadoEmBetween(status, inicio, fim);
        }
        return entregaRepository.findByCriadoEmBetween(inicio, fim);
    }

    @Transactional
    public Optional<Entrega> cancelarEntrega(String codigoRastreio, String motivo) {
        Optional<Entrega> opt = entregaRepository.findByCodigoRastreio(codigoRastreio);
        if (opt.isEmpty()) {
            return Optional.empty();
        }

        Entrega entrega = opt.get();
        if (entrega.getStatusAtual() == StatusEntrega.ENTREGUE) {
            throw new IllegalStateException("Nao e possivel cancelar uma entrega ja entregue");
        }

        entrega.setStatusAtual(StatusEntrega.CANCELADO);
        entrega = entregaRepository.save(entrega);

        registrarHistorico(entrega, StatusEntrega.CANCELADO, motivo);

        return Optional.of(entrega);
    }

    private String gerarCodigoRastreio() {
        String dataPart = LocalDate.now().format(DATE_FORMAT);
        String prefixo = "TL-" + dataPart + "-";
        long sequencia = entregaRepository.countByCodigoRastreioStartingWith(prefixo) + 1;
        return prefixo + String.format("%04d", sequencia);
    }

    private void registrarHistorico(Entrega entrega, StatusEntrega status, String observacao) {
        StatusHistorico historico = StatusHistorico.builder()
                .entrega(entrega)
                .status(status)
                .observacao(observacao)
                .build();
        statusHistoricoRepository.save(historico);
    }

    private boolean transicaoValida(StatusEntrega atual, StatusEntrega novo) {
        if (atual == novo) {
            return false;
        }
        return switch (atual) {
            case COLETADO -> novo == StatusEntrega.EM_TRANSITO;
            case EM_TRANSITO -> novo == StatusEntrega.SAIU_PARA_ENTREGA;
            case SAIU_PARA_ENTREGA ->
                    novo == StatusEntrega.ENTREGUE || novo == StatusEntrega.TENTATIVA_FALHA;
            case TENTATIVA_FALHA -> novo == StatusEntrega.SAIU_PARA_ENTREGA;
            case ENTREGUE, CANCELADO -> false;
        };
    }
}
