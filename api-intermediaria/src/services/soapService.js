const soap = require('soap');

let client = null;

async function getClient() {
  if (client) return client;
  client = await soap.createClientAsync(process.env.SOAP_WSDL_URL);
  return client;
}

function toCamelCase(str) {
  return str.replace(/[-_](.)/g, (_, c) => c.toUpperCase());
}

function mapKeys(obj) {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(mapKeys);
  if (obj instanceof Date) return obj.toISOString();
  if (typeof obj === 'object') {
    const mapped = {};
    for (const key of Object.keys(obj)) {
      mapped[toCamelCase(key)] = mapKeys(obj[key]);
    }
    return mapped;
  }
  return obj;
}

function getEntregaFromResult(result) {
  if (!result) return null;
  const keys = Object.keys(result);
  const responseKey = keys.find(k => k.endsWith('Response'));
  const container = responseKey ? result[responseKey] : result;
  if (!container) return null;
  const entrega = container.entrega || container;
  if (!entrega || typeof entrega !== 'object' || Object.keys(entrega).length === 0) return null;
  return mapKeys(entrega);
}

function extractList(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(mapKeys);
  if (typeof raw !== 'object') return [];
  const keys = Object.keys(raw);
  if (keys.length === 0) return [];
  if (keys.every(k => /^\d+$/.test(k))) {
    return keys.sort((a, b) => parseInt(a) - parseInt(b)).map(k => mapKeys(raw[k]));
  }
  return [mapKeys(raw)];
}

function getListaFromResult(result) {
  if (!result) return [];
  const keys = Object.keys(result);
  const responseKey = keys.find(k => k.endsWith('Response'));
  const container = responseKey ? result[responseKey] : result;
  if (!container || typeof container !== 'object') return [];
  const candidate = container.entrega || container.entregas || container;
  return extractList(candidate);
}

async function criarEntrega(dados) {
  const c = await getClient();
  const args = {
    remetenteNome: dados.remetenteNome,
    remetenteCidade: dados.remetenteCidade,
    destinatarioNome: dados.destinatarioNome,
    destinatarioCidade: dados.destinatarioCidade,
    destinatarioEndereco: dados.destinatarioEndereco,
    pesoKg: dados.pesoKg,
  };
  const [result] = await c.criarEntregaAsync(args);
  return getEntregaFromResult(result);
}

async function rastrearEntrega(codigoRastreio) {
  const c = await getClient();
  const [result] = await c.rastrearEntregaAsync({ codigoRastreio });
  return getEntregaFromResult(result);
}

async function atualizarStatus(codigoRastreio, novoStatus, observacao) {
  const c = await getClient();
  const args = { codigoRastreio, novoStatus, observacao: observacao || '' };
  const [result] = await c.atualizarStatusAsync(args);
  return getEntregaFromResult(result);
}

async function listarEntregas(filtros = {}) {
  const c = await getClient();
  const args = {};
  if (filtros.dataInicio) args.dataInicio = filtros.dataInicio;
  if (filtros.dataFim) args.dataFim = filtros.dataFim;
  if (filtros.status) args.status = filtros.status;
  const [result] = await c.listarEntregasAsync(args);
  return getListaFromResult(result);
}

async function cancelarEntrega(codigoRastreio, motivo) {
  const c = await getClient();
  const [result] = await c.cancelarEntregaAsync({ codigoRastreio, motivo });
  return getEntregaFromResult(result);
}

module.exports = {
  criarEntrega,
  rastrearEntrega,
  atualizarStatus,
  listarEntregas,
  cancelarEntrega,
};
