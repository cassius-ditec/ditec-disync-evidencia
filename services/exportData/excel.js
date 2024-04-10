var XLSX = require("xlsx");

function extractFieldValue(obj, fieldRef) {
    return fieldRef.includes('.') ? fieldRef.split('.').reduce((o, i) => o[i], obj) : obj[fieldRef];
}

function mapDataToSheet(data, cols, colunaTabulada) {
    const sheetData = [];
    const setaUnicode = "|_"; // Exemplo de seta unicode

    function processObject(obj, nivel = 0) {
        const rowData = cols.map(col => {
            const fieldValue = extractFieldValue(obj, col[1]);
            const fieldFilter = col[2];
            const filteredValue = fieldFilter ? fieldFilter(fieldValue) : fieldValue;

            // Adicionar seta unicode apenas à colunaTabulada e aos filhos
            const valueWithIndentation =
                col[1] === colunaTabulada && nivel > 0 ? setaUnicode + ' ' + filteredValue : filteredValue;

            return valueWithIndentation;
        });

        // Adicionar espaçamento proporcional ao nível de hierarquia
        if (colunaTabulada) {
            const indiceColunaTabulada = cols.findIndex(col => col[1] === colunaTabulada);
            if (indiceColunaTabulada !== -1) {
                rowData[indiceColunaTabulada] = Array.from({ length: nivel }, () => '_').join('') + rowData[indiceColunaTabulada];
            }
        }

        sheetData.push(rowData);

        if (obj.children && obj.children.length > 0) {
            obj.children.forEach(child => {
                processObject(child, nivel + 1);
            });
        }
    }

    data.forEach(obj => {
        processObject(obj);
    });

    return sheetData;
}

export function createExcel(title, data, cols, colunaTabulada = null) {
    const sheetData = mapDataToSheet(data, cols, colunaTabulada);
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Planilha 1');

    const currentDate = new Date().toLocaleDateString().replace(/\//g, '-');
    const fileName = `${title}_${currentDate}.xlsx`;

    XLSX.writeFile(workbook, fileName);
}
