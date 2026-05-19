package com.translog.config;

import com.translog.entity.StatusEntrega;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataLoader.class);
    private static final DateTimeFormatter DF = DateTimeFormatter.ofPattern("yyyyMMdd");

    private final JdbcTemplate jdbc;

    public DataLoader(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void run(String... args) {
        Long count = jdbc.queryForObject("SELECT COUNT(*) FROM entregas", Long.class);
        if (count != null && count > 0) {
            log.info("Banco ja possui {} entregas — pulando seed", count);
            return;
        }

        log.info("Inserindo dados de amostra...");
        inserirEntregas();
        log.info("Seed concluido — 20 entregas inseridas");
    }

    private void inserirEntregas() {
        List<EntregaSeed> seeds = List.of(
            seed("João Silva", "São Paulo, SP", "Maria Santos", "Rio de Janeiro, RJ", "Rua das Flores, 123", 2.5,
                 StatusEntrega.ENTREGUE, 25,
                 hist(StatusEntrega.COLETADO, "Coleta realizada", 25),
                 hist(StatusEntrega.EM_TRANSITO, "Saiu para distribuição", 24),
                 hist(StatusEntrega.SAIU_PARA_ENTREGA, "Rota de entrega", 23),
                 hist(StatusEntrega.ENTREGUE, "Entregue ao destinatário", 22)),

            seed("Carlos Oliveira", "Belo Horizonte, MG", "Ana Souza", "São Paulo, SP", "Av Paulista, 1000", 5.0,
                 StatusEntrega.ENTREGUE, 22,
                 hist(StatusEntrega.COLETADO, "Coleta realizada", 22),
                 hist(StatusEntrega.EM_TRANSITO, "Em transferência", 21),
                 hist(StatusEntrega.SAIU_PARA_ENTREGA, "Em rota", 20),
                 hist(StatusEntrega.ENTREGUE, "Entregue", 19)),

            seed("Pedro Costa", "Curitiba, PR", "Juliana Lima", "Porto Alegre, RS", "Rua dos Andradas, 500", 1.2,
                 StatusEntrega.ENTREGUE, 18,
                 hist(StatusEntrega.COLETADO, "Coleta OK", 18),
                 hist(StatusEntrega.EM_TRANSITO, "Em deslocamento", 17),
                 hist(StatusEntrega.SAIU_PARA_ENTREGA, "Rota final", 16),
                 hist(StatusEntrega.ENTREGUE, "Recebido", 15)),

            seed("Mariana Rocha", "Salvador, BA", "Rafael Almeida", "Recife, PE", "Rua da Aurora, 200", 3.8,
                 StatusEntrega.ENTREGUE, 15,
                 hist(StatusEntrega.COLETADO, "Coletado", 15),
                 hist(StatusEntrega.EM_TRANSITO, "Viagem intermunicipal", 14),
                 hist(StatusEntrega.SAIU_PARA_ENTREGA, "Saiu para entrega", 13),
                 hist(StatusEntrega.ENTREGUE, "Entregue", 12)),

            seed("Lucas Mendes", "Fortaleza, CE", "Beatriz Nunes", "Natal, RN", "Av Beira Mar, 300", 0.8,
                 StatusEntrega.ENTREGUE, 12,
                 hist(StatusEntrega.COLETADO, "Coletado", 12),
                 hist(StatusEntrega.EM_TRANSITO, "Transporte rodoviário", 11),
                 hist(StatusEntrega.SAIU_PARA_ENTREGA, "Última milha", 10),
                 hist(StatusEntrega.ENTREGUE, "Entregue", 9)),

            seed("Fernando Dias", "Brasília, DF", "Camila Barbosa", "Goiânia, GO", "Rua 15, 400", 4.5,
                 StatusEntrega.ENTREGUE, 8,
                 hist(StatusEntrega.COLETADO, "Coleta", 8),
                 hist(StatusEntrega.EM_TRANSITO, "Em trânsito", 7),
                 hist(StatusEntrega.SAIU_PARA_ENTREGA, "Saiu para entrega", 6),
                 hist(StatusEntrega.ENTREGUE, "Finalizado", 5)),

            seed("Roberto Campos", "Manaus, AM", "Tatiane Farias", "Belém, PA", "Tv Padre Eutíquio, 150", 7.2,
                 StatusEntrega.ENTREGUE, 5,
                 hist(StatusEntrega.COLETADO, "Coleta", 5),
                 hist(StatusEntrega.EM_TRANSITO, "Transporte fluvial", 4),
                 hist(StatusEntrega.SAIU_PARA_ENTREGA, "Rota local", 3),
                 hist(StatusEntrega.ENTREGUE, "Entregue", 2)),

            seed("Amanda Torres", "São Paulo, SP", "Gustavo Castro", "Curitiba, PR", "Rua XV de Novembro, 800", 1.5,
                 StatusEntrega.EM_TRANSITO, 3,
                 hist(StatusEntrega.COLETADO, "Coleta realizada", 3),
                 hist(StatusEntrega.EM_TRANSITO, "Saiu para distribuição", 2)),

            seed("Diego Martins", "Rio de Janeiro, RJ", "Larissa Pinto", "Belo Horizonte, MG", "Rua da Bahia, 700", 3.0,
                 StatusEntrega.EM_TRANSITO, 2,
                 hist(StatusEntrega.COLETADO, "Coletado", 2),
                 hist(StatusEntrega.EM_TRANSITO, "Em transporte", 1)),

            seed("Isabela Gomes", "Porto Alegre, RS", "Thiago Barbosa", "Florianópolis, SC", "Av Beira Mar Norte, 100", 2.0,
                 StatusEntrega.SAIU_PARA_ENTREGA, 1,
                 hist(StatusEntrega.COLETADO, "Coleta OK", 3),
                 hist(StatusEntrega.EM_TRANSITO, "Viagem", 2),
                 hist(StatusEntrega.SAIU_PARA_ENTREGA, "Em rota de entrega", 1)),

            seed("Eduardo Santos", "Recife, PE", "Patrícia Oliveira", "Maceió, AL", "Rua do Comércio, 50", 1.8,
                 StatusEntrega.SAIU_PARA_ENTREGA, 0,
                 hist(StatusEntrega.COLETADO, "Coleta", 1),
                 hist(StatusEntrega.EM_TRANSITO, "Transferência", 0),
                 hist(StatusEntrega.SAIU_PARA_ENTREGA, "Rota final", 0)),

            seed("Vanessa Rios", "São Paulo, SP", "Bruno Nascimento", "Campinas, SP", "Rua 13 de Maio, 250", 0.5,
                 StatusEntrega.COLETADO, 0,
                 hist(StatusEntrega.COLETADO, "Coleta recente", 0)),

            seed("Fábio Moreira", "Belo Horizonte, MG", "Cíntia Duarte", "Uberlândia, MG", "Av Afonso Pena, 1200", 6.0,
                 StatusEntrega.COLETADO, 1,
                 hist(StatusEntrega.COLETADO, "Aguardando processamento", 1)),

            seed("Giovanna Costa", "Rio de Janeiro, RJ", "Antônio Silva", "Niterói, RJ", "Rua Visconde de Itaboraí, 80", 2.2,
                 StatusEntrega.TENTATIVA_FALHA, 4,
                 hist(StatusEntrega.COLETADO, "Coleta", 4),
                 hist(StatusEntrega.EM_TRANSITO, "Em rota", 3),
                 hist(StatusEntrega.SAIU_PARA_ENTREGA, "Tentativa", 2),
                 hist(StatusEntrega.TENTATIVA_FALHA, "Destinatário ausente — tentativa 1", 1)),

            seed("Hélio Matos", "Salvador, BA", "Sandra Vieira", "Feira de Santana, BA", "Rua Conselheiro Franco, 90", 3.5,
                 StatusEntrega.TENTATIVA_FALHA, 6,
                 hist(StatusEntrega.COLETADO, "Coleta", 6),
                 hist(StatusEntrega.EM_TRANSITO, "Saiu", 5),
                 hist(StatusEntrega.SAIU_PARA_ENTREGA, "Rota", 4),
                 hist(StatusEntrega.TENTATIVA_FALHA, "Endereço incorreto", 3)),

            seed("Renata Freitas", "São Paulo, SP", "Paulo Henrique", "Santos, SP", "Rua General Câmara, 300", 1.0,
                 StatusEntrega.CANCELADO, 20,
                 hist(StatusEntrega.COLETADO, "Coleta", 20),
                 hist(StatusEntrega.EM_TRANSITO, "Cancelado pelo remetente", 19),
                 hist(StatusEntrega.CANCELADO, "Solicitação do cliente", 18)),

            seed("Leandro Araújo", "Curitiba, PR", "Débora Cardoso", "Londrina, PR", "Rua Sergipe, 600", 4.0,
                 StatusEntrega.CANCELADO, 10,
                 hist(StatusEntrega.COLETADO, "Coleta", 10),
                 hist(StatusEntrega.CANCELADO, "Desistência do remetente", 9)),

            seed("Simone Vargas", "São Paulo, SP", "Alexandre Pereira", "Ribeirão Preto, SP", "Rua Barão do Amazonas, 45", 10.0,
                 StatusEntrega.ENTREGUE, 28,
                 hist(StatusEntrega.COLETADO, "Coleta", 28),
                 hist(StatusEntrega.EM_TRANSITO, "Transporte", 27),
                 hist(StatusEntrega.SAIU_PARA_ENTREGA, "Rota", 26),
                 hist(StatusEntrega.ENTREGUE, "Entregue com sucesso", 25)),

            seed("Michele Azevedo", "Goiânia, GO", "Rogério Campos", "Brasília, DF", "CLN 403 Bloco B, 10", 2.8,
                 StatusEntrega.EM_TRANSITO, 7,
                 hist(StatusEntrega.COLETADO, "Coleta", 7),
                 hist(StatusEntrega.EM_TRANSITO, "Em viagem", 6)),

            seed("Adriano Reis", "Belém, PA", "Luciana Mendes", "Macapá, AP", "Av Fábio Aleixo, 180", 5.5,
                 StatusEntrega.SAIU_PARA_ENTREGA, 2,
                 hist(StatusEntrega.COLETADO, "Coleta", 4),
                 hist(StatusEntrega.EM_TRANSITO, "Transporte fluvial", 3),
                 hist(StatusEntrega.SAIU_PARA_ENTREGA, "Rota de entrega", 2))
        );

        String sqlEntrega = """
            INSERT INTO entregas (codigo_rastreio, remetente_nome, remetente_cidade,
                destinatario_nome, destinatario_cidade, destinatario_endereco,
                peso_kg, status_atual, criado_em, atualizado_em)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;

        String sqlHistorico = """
            INSERT INTO status_historico (entrega_id, status, observacao, registrado_em)
            VALUES (?, ?, ?, ?)
            """;

        int seq = 0;
        for (EntregaSeed s : seeds) {
            seq++;
            String codigo = "TL-" + s.criadoEm.format(DF) + "-" + String.format("%04d", seq);

            jdbc.update(sqlEntrega,
                codigo,
                s.remetenteNome, s.remetenteCidade,
                s.destinatarioNome, s.destinatarioCidade, s.destinatarioEndereco,
                s.pesoKg, s.statusAtual.name(),
                s.criadoEm, s.atualizadoEm
            );

            Long entregaId = jdbc.queryForObject(
                "SELECT currval(pg_get_serial_sequence('entregas', 'id'))", Long.class);

            for (HistoricoSeed h : s.historico) {
                jdbc.update(sqlHistorico, entregaId, h.status.name(), h.observacao, h.registradoEm);
            }
        }
    }

    private static EntregaSeed seed(String remNome, String remCid, String desNome,
                                     String desCid, String desEnd, double peso,
                                     StatusEntrega status, int diasAtras,
                                     HistoricoSeed... historico) {
        LocalDateTime criadoEm = LocalDate.now().minusDays(diasAtras).atStartOfDay();
        return new EntregaSeed(remNome, remCid, desNome, desCid, desEnd, peso,
            status, criadoEm, criadoEm, List.of(historico));
    }

    private static HistoricoSeed hist(StatusEntrega status, String obs, int diasAtras) {
        return new HistoricoSeed(status, obs,
            LocalDate.now().minusDays(diasAtras).atTime(10, 0));
    }

    private record EntregaSeed(
        String remetenteNome, String remetenteCidade,
        String destinatarioNome, String destinatarioCidade, String destinatarioEndereco,
        double pesoKg, StatusEntrega statusAtual,
        LocalDateTime criadoEm, LocalDateTime atualizadoEm,
        List<HistoricoSeed> historico
    ) {}

    private record HistoricoSeed(StatusEntrega status, String observacao, LocalDateTime registradoEm) {}
}
