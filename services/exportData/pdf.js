import jsPDF from 'jspdf';
import 'jspdf-autotable';

function extrairValorCampo(obj, fieldRef) {
    return fieldRef.includes('.') ? fieldRef.split('.').reduce((o, i) => o[i], obj) : obj[fieldRef];
}

function mapearDadosParaLinhas(data, cols, colunaTabulada) {
    const linhas = [];

    function processarObjeto(obj, nivel = 0) {
        const setaUnicode = "|_"; // Exemplo de seta unicode

        const rowData = cols.map(col => {
            const valorCampo = extrairValorCampo(obj, col[1]);
            const filtroCampo = col[2];
            const valorFiltrado = filtroCampo ? filtroCampo(valorCampo) : valorCampo;

            // Adicionar seta unicode apenas à colunaTabulada e aos filhos
            const valorFinal =
                col[1] === colunaTabulada && nivel > 0 ? setaUnicode + ' ' + valorFiltrado : valorFiltrado;

            return valorFinal;
        });

        // Adicionar espaçamento proporcional ao nível de hierarquia
        if (colunaTabulada) {
            const indiceColunaTabulada = cols.findIndex(col => col[1] === colunaTabulada);
            if (indiceColunaTabulada !== -1) {
                rowData[indiceColunaTabulada] = Array.from({ length: nivel }, () => '\t').join('') + rowData[indiceColunaTabulada];
            }
        }

        linhas.push(rowData);

        if (obj.children && obj.children.length > 0) {
            obj.children.forEach(child => {
                processarObjeto(child, nivel + 1);
            });
        }
    }

    data.forEach(obj => {
        processarObjeto(obj);
    });

    return linhas;
}


function gerarCabecalhoPDF(doc, titulo, x, y) {
    const alturaTitulo = doc.getTextDimensions(titulo).h;
    doc.text(titulo, x, y);
    return y + alturaTitulo;
}

function gerarTabelaPDF(doc, cabecalhosTabela, linhasTabela, startY) {
    doc.autoTable({
        head: [cabecalhosTabela],
        body: linhasTabela,
        startY: startY,
        styles: {
            fontSize: 8,
        },
    });
}

export function createPDF(titulo, dados, cols, colunaTabulada = null) {
    const doc = new jsPDF('landscape');
    const cabecalhosTabela = cols.map(col => {
        return col[0];
    });

    const linhasTabela = mapearDadosParaLinhas(dados, cols, colunaTabulada);

    const xCabecalho = 10;
    const yCabecalho = 10;

    const yInicioTabela = gerarCabecalhoPDF(doc, titulo, xCabecalho, yCabecalho);

    gerarTabelaPDF(doc, cabecalhosTabela, linhasTabela, yInicioTabela);

    const dataAtual = new Date().toLocaleDateString().replace(/\//g, '-');
    const nomeArquivo = `${titulo}_${dataAtual}.pdf`;
    doc.save(nomeArquivo);
}
