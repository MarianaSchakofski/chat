// Variável global para armazenar o código do cliente atual
let codigoClienteAtual = null;

// Função para pesquisar movimento mensal
async function pesquisarMovimento() {
    const codigo = document.getElementById('pesquisa-codigo').value.trim();

    if (!codigo) {
        alert('Por favor, digite um código de cliente.');
        return;
    }

    try {
        // Primeiro, buscar informações do cliente
        const responseCliente = await fetch(`/clientes?codigo=${codigo}`);

        if (!responseCliente.ok) {
            throw new Error('Cliente não encontrado');
        }

        const cliente = await responseCliente.json();

        // Exibir informações do cliente
        document.getElementById('cliente-nome').textContent = cliente.nome;
        document.getElementById('cliente-telefone').textContent = cliente.telefone;
        document.getElementById('info-cliente').style.display = 'block';

        // Buscar movimentos do mês selecionado
        const mes = document.getElementById('selecionar-mes').value;
        const ano = document.getElementById('selecionar-ano').value;

        const responseMovimentos = await fetch(`/movimento/mes?codigo=${codigo}&mes=${mes}&ano=${ano}`);

        if (!responseMovimentos.ok) {
            throw new Error('Erro ao buscar movimentos');
        }

        const movimentos = await responseMovimentos.json();

        // Armazenar código do cliente para uso posterior
        codigoClienteAtual = codigo;

        // Preencher tabela com os movimentos
        preencherTabelaMovimentos(movimentos);

        // Calcular e exibir resumo mensal
        calcularResumoMensal(movimentos);

    } catch (error) {
        console.error('Erro ao pesquisar movimento:', error);
        alert('Erro ao buscar dados: ' + error.message);
    }
}

// Função para preencher a tabela com os movimentos
function preencherTabelaMovimentos(movimentos) {
    const tabela = document.getElementById('tabela-movimento-mes');
    tabela.innerHTML = '';

    if (movimentos.length === 0) {
        tabela.innerHTML = '<tr><td colspan="5">Nenhum movimento encontrado para este período.</td></tr>';
        document.getElementById('resumo-mensal').style.display = 'none';
        return;
    }

    movimentos.forEach(movimento => {
        const data = new Date(movimento.data);
        const diaSemana = obterDiaSemana(data.getDay());
        const tempoPermanencia = calcularTempoPermanencia(movimento.horarioE, movimento.horarioS);

        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${formatarData(data)}</td>
            <td>${diaSemana}</td>
            <td>${movimento.horarioE}</td>
            <td>${movimento.horarioS}</td>
            <td>${tempoPermanencia}</td>
        `;
        tabela.appendChild(linha);
    });

    document.getElementById('resumo-mensal').style.display = 'block';
}

// Função para calcular resumo mensal
function calcularResumoMensal(movimentos) {
    const totalDias = movimentos.length;

    let totalMinutos = 0;
    movimentos.forEach(movimento => {
        const tempo = calcularTempoMinutos(movimento.horarioE, movimento.horarioS);
        totalMinutos += tempo;
    });

    const mediaMinutos = totalDias > 0 ? Math.round(totalMinutos / totalDias) : 0;
    const mediaHoras = formatarHorasFromMinutos(mediaMinutos);

    document.getElementById('total-dias').textContent = totalDias;
    document.getElementById('media-horas').textContent = mediaHoras;
}

// Função auxiliar para calcular tempo em minutos entre dois horários
function calcularTempoMinutos(entrada, saida) {
    const [hEntrada, mEntrada] = entrada.split(':').map(Number);
    const [hSaida, mSaida] = saida.split(':').map(Number);

    const minutosEntrada = hEntrada * 60 + mEntrada;
    const minutosSaida = hSaida * 60 + mSaida;

    return minutosSaida - minutosEntrada;
}

// Função para formatar minutos em horas (ex: 125 → "2h05")
function formatarHorasFromMinutos(minutos) {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h${mins.toString().padStart(2, '0')}`;
}

// Função para calcular tempo de permanência
function calcularTempoPermanencia(entrada, saida) {
    const minutos = calcularTempoMinutos(entrada, saida);
    return formatarHorasFromMinutos(minutos);
}

// Função para obter dia da semana
function obterDiaSemana(dia) {
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return dias[dia];
}

// Função para formatar data (dd/mm/aaaa)
function formatarData(data) {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// Função para voltar para a página de cadastro
function voltarParaCadastro() {
    window.location.href = 'cadastro.html';
}

// Função para imprimir relatório
function imprimirRelatorio() {
    if (!codigoClienteAtual) {
        alert('Por favor, pesquise um cliente primeiro.');
        return;
    }

    window.print();
}

// Função para exportar dados (simulação)
function exportarDados() {
    if (!codigoClienteAtual) {
        alert('Por favor, pesquise um cliente primeiro.');
        return;
    }

    alert('Funcionalidade de exportação será implementada em breve!');
}

// Event listeners para atualizar automaticamente ao mudar mês/ano
document.getElementById('selecionar-mes').addEventListener('change', function() {
    if (codigoClienteAtual) {
        pesquisarMovimento();
    }
});

document.getElementById('selecionar-ano').addEventListener('change', function() {
    if (codigoClienteAtual) {
        pesquisarMovimento();
    }
});

// Inicialização da página
document.addEventListener('DOMContentLoaded', function() {
    // Definir mês atual como padrão
    const mesAtual = new Date().getMonth() + 1;
    document.getElementById('selecionar-mes').value = mesAtual;
});
