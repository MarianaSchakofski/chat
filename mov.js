async function Pesquisar() {
    const searchTerm = document.getElementById('search').value.trim();

    if (!searchTerm) {
        alert('Por favor, digite um código, nome ou CPF para pesquisar');
        return;
    }

    try {
        // Buscar informações completas do movimento
        const response = await fetch(`/movimento/completo?search=${encodeURIComponent(searchTerm)}`);
        
        if (!response.ok) {
            throw new Error('Erro na resposta da rede');
        }
        
        const dados = await response.json();

        const resultContainer = document.getElementById('result-container');
        resultContainer.style.display = 'block';
        resultContainer.innerHTML = '';

        if (dados.length === 0) {
            resultContainer.innerHTML = '<div class="caixa-resposta"><p>Nenhum cliente encontrado.</p></div>';
            return;
        }

        // Para cada cliente encontrado, mostra as informações
        dados.forEach(cliente => {
            const caixa = document.createElement('div');
            caixa.className = 'caixa-resposta';

            caixa.innerHTML = `
                <h3>${cliente.nome} (Código: ${cliente.codigo})</h3>
                <div class="cliente-info">
                    <div class="info-group">
                        <span class="info-label">CPF:</span> ${cliente.cpf || 'N/A'}
                    </div>
                    <div class="info-group">
                        <span class="info-label">Idade:</span> ${cliente.idade || 'N/A'}
                    </div>
                    <div class="info-group">
                        <span class="info-label">Telefone:</span> ${cliente.telefone || 'N/A'}
                    </div>
                    <div class="info-group">
                        <span class="info-label">Email:</span> ${cliente.email || 'N/A'}
                    </div>
                    <div class="info-group">
                        <span class="info-label">Endereço:</span> ${cliente.endereco || 'N/A'}
                    </div>
                    <div class="info-group">
                        <span class="info-label">Mês:</span> ${cliente.mes || 'N/A'}
                    </div>
                    <div class="info-group">
                        <span class="info-label">Treinos:</span> ${cliente.treinos || '0'}
                    </div>
                    <div class="info-group">
                        <span class="info-label">Faltas:</span> ${cliente.faltas || '0'}
                    </div>
                    <div class="info-group">
                        <span class="info-label">Valor:</span> R$ ${cliente.valor || '0,00'}
                    </div>
                    <div class="info-group">
                        <span class="info-label">Pago:</span> ${cliente.pago || 'Não'}
                    </div>
                </div>
            `;

            resultContainer.appendChild(caixa);
        });

    } catch (error) {
        console.error('Erro na pesquisa:', error);
        alert('Erro ao realizar a pesquisa. Verifique a conexão.');
    }
}

function voltarpagina() {
    window.location.href = 'escolha.html';
}

function limpaFormulario() {
    document.getElementById('search').value = '';
    const resultContainer = document.getElementById('result-container');
    resultContainer.style.display = 'none';
    resultContainer.innerHTML = '';
}

// Adicionar evento de enter no campo de pesquisa
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                Pesquisar();
            }
        });
    }
});
