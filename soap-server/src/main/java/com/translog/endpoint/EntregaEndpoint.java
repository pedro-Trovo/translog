package com.translog.endpoint;

import com.translog.entity.Entrega;
import com.translog.entity.StatusEntrega;
import com.translog.entity.StatusHistorico;
import com.translog.service.EntregaService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;
import org.w3c.dom.*;

import javax.xml.parsers.DocumentBuilderFactory;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Endpoint
public class EntregaEndpoint {

    private static final String NS = "http://translog.com/entregas";
    private static final DateTimeFormatter DTF = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
    private static final DateTimeFormatter DF = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final EntregaService entregaService;

    public EntregaEndpoint(EntregaService entregaService) {
        this.entregaService = entregaService;
    }

    @PayloadRoot(namespace = NS, localPart = "criarEntregaRequest")
    @ResponsePayload
    @Transactional
    public Element criarEntrega(@RequestPayload Element request) throws Exception {
        Document doc = newDocument();
        String[] v = extractText(request, "remetenteNome", "remetenteCidade",
                "destinatarioNome", "destinatarioCidade", "destinatarioEndereco");
        String pesoStr = getText(request, "pesoKg");
        Double peso = (pesoStr != null && !pesoStr.isEmpty()) ? Double.parseDouble(pesoStr) : null;

        Entrega e = entregaService.criarEntrega(v[0], v[1], v[2], v[3], v[4], peso);
        Element root = doc.createElementNS(NS, "criarEntregaResponse");
        root.appendChild(toXmlEntrega(doc, e));
        return root;
    }

    @PayloadRoot(namespace = NS, localPart = "rastrearEntregaRequest")
    @ResponsePayload
    @Transactional(readOnly = true)
    public Element rastrearEntrega(@RequestPayload Element request) throws Exception {
        Document doc = newDocument();
        String codigo = getText(request, "codigoRastreio");
        Element root = doc.createElementNS(NS, "rastrearEntregaResponse");
        entregaService.rastrearEntrega(codigo)
                .ifPresent(e -> root.appendChild(toXmlEntrega(doc, e)));
        return root;
    }

    @PayloadRoot(namespace = NS, localPart = "atualizarStatusRequest")
    @ResponsePayload
    @Transactional
    public Element atualizarStatus(@RequestPayload Element request) throws Exception {
        Document doc = newDocument();
        String codigo = getText(request, "codigoRastreio");
        StatusEntrega novoStatus = StatusEntrega.valueOf(getText(request, "novoStatus"));
        String obs = getText(request, "observacao");
        Element root = doc.createElementNS(NS, "atualizarStatusResponse");
        entregaService.atualizarStatus(codigo, novoStatus, obs)
                .ifPresent(e -> root.appendChild(toXmlEntrega(doc, e)));
        return root;
    }

    @PayloadRoot(namespace = NS, localPart = "listarEntregasRequest")
    @ResponsePayload
    @Transactional(readOnly = true)
    public Element listarEntregas(@RequestPayload Element request) throws Exception {
        Document doc = newDocument();
        String di = getText(request, "dataInicio");
        String df = getText(request, "dataFim");
        String st = getText(request, "status");
        var entregas = entregaService.listarEntregas(
                di != null ? LocalDate.parse(di, DF) : null,
                df != null ? LocalDate.parse(df, DF) : null,
                st != null ? StatusEntrega.valueOf(st) : null);
        Element root = doc.createElementNS(NS, "listarEntregasResponse");
        for (Entrega e : entregas) {
            root.appendChild(toXmlEntrega(doc, e));
        }
        return root;
    }

    @PayloadRoot(namespace = NS, localPart = "cancelarEntregaRequest")
    @ResponsePayload
    @Transactional
    public Element cancelarEntrega(@RequestPayload Element request) throws Exception {
        Document doc = newDocument();
        String codigo = getText(request, "codigoRastreio");
        String motivo = getText(request, "motivo");
        Element root = doc.createElementNS(NS, "cancelarEntregaResponse");
        entregaService.cancelarEntrega(codigo, motivo)
                .ifPresent(e -> root.appendChild(toXmlEntrega(doc, e)));
        return root;
    }

    private Element toXmlEntrega(Document doc, Entrega e) {
        Element xml = doc.createElementNS(NS, "entrega");
        addChild(doc, xml, "id", String.valueOf(e.getId()));
        addChild(doc, xml, "codigoRastreio", e.getCodigoRastreio());
        addChild(doc, xml, "remetenteNome", e.getRemetenteNome());
        addChild(doc, xml, "remetenteCidade", e.getRemetenteCidade());
        addChild(doc, xml, "destinatarioNome", e.getDestinatarioNome());
        addChild(doc, xml, "destinatarioCidade", e.getDestinatarioCidade());
        addChild(doc, xml, "destinatarioEndereco", e.getDestinatarioEndereco());
        if (e.getPesoKg() != null) {
            addChild(doc, xml, "pesoKg", e.getPesoKg().toString());
        }
        addChild(doc, xml, "statusAtual", e.getStatusAtual().name());
        addChild(doc, xml, "criadoEm", e.getCriadoEm().format(DTF));
        addChild(doc, xml, "atualizadoEm", e.getAtualizadoEm().format(DTF));
        for (StatusHistorico sh : e.getStatusHistorico()) {
            Element h = doc.createElementNS(NS, "statusHistorico");
            addChild(doc, h, "status", sh.getStatus().name());
            addChild(doc, h, "observacao", sh.getObservacao());
            addChild(doc, h, "registradoEm", sh.getRegistradoEm().format(DTF));
            xml.appendChild(h);
        }
        return xml;
    }

    private void addChild(Document doc, Element parent, String tag, String value) {
        if (value == null) return;
        Element child = doc.createElementNS(NS, tag);
        child.setTextContent(value);
        parent.appendChild(child);
    }

    private String getText(Element parent, String tag) {
        NodeList list = parent.getChildNodes();
        for (int i = 0; i < list.getLength(); i++) {
            Node n = list.item(i);
            if (n.getNodeType() == Node.ELEMENT_NODE && tag.equals(n.getLocalName())) {
                return n.getTextContent();
            }
        }
        return null;
    }

    private String[] extractText(Element parent, String... tags) {
        String[] vals = new String[tags.length];
        for (int i = 0; i < tags.length; i++) {
            vals[i] = getText(parent, tags[i]);
        }
        return vals;
    }

    private Document newDocument() throws Exception {
        return DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument();
    }
}
