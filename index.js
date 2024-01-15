class GUI {
    cpfDV(cpf) {
        let soma = (cpf[0] * 10 + cpf[1] * 9 + cpf[2] * 8 + cpf[3] * 7 + cpf[4] * 6 + cpf[5] * 5 + cpf[6] * 4 + cpf[7] * 3 + cpf[8] * 2) % 11;
        let dv1 = (soma < 2) ? 0 : 11 - soma;
        soma = (cpf[0] * 11 + cpf[1] * 10 + cpf[2] * 9 + cpf[3] * 8 + cpf[4] * 7 + cpf[5] * 6 + cpf[6] * 5 + cpf[7] * 4 + cpf[8] * 3 + dv1 * 2) % 11;
        let dv2 = (soma < 2) ? 0 : 11 - soma;
        return [dv1, dv2];
    }
    cnpjDV(cnpj) {
        cnpj = cnpj.replace(/[^\d]+/g, '');
        let tamanho = cnpj.length;
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += cnpj.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        let dv1 = soma % 11 < 2 ? 0 : 11 - soma % 11;
        tamanho = tamanho + 1;
        let numeros = cnpj + dv1;
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        let dv2 = soma % 11 < 2 ? 0 : 11 - soma % 11;
        return [dv1, dv2];
    }
    tituloDV(inscricao) {
        let paddedInsc = inscricao;
        let dig1 = 0;
        let dig2 = 0;

        let tam = paddedInsc.length;
        let estado = paddedInsc.substring(tam - 2, tam);
        let titulo = paddedInsc.substring(0, tam - 2);
        let exce = (parseInt(estado) === 1) || (parseInt(estado) === 2);
        dig1 = (titulo.charCodeAt(0) - 48) * 9 + (titulo.charCodeAt(1) - 48) * 8 +
            (titulo.charCodeAt(2) - 48) * 7 + (titulo.charCodeAt(3) - 48) * 6 +
            (titulo.charCodeAt(4) - 48) * 5 + (titulo.charCodeAt(5) - 48) * 4 +
            (titulo.charCodeAt(6) - 48) * 3 + (titulo.charCodeAt(7) - 48) * 2;
        let resto = dig1 % 11;
        if (resto === 0) {
            dig1 = exce ? 1 : 0;
        } else {
            dig1 = resto === 1 ? 0 : 11 - resto;
        }
        dig2 = (inscricao.charCodeAt(8) - 48) * 4 + (inscricao.charCodeAt(9) - 48) * 3 + dig1 * 2;
        resto = dig2 % 11;
        if (resto === 0) {
            dig2 = exce ? 1 : 0;
        } else {
            dig2 = resto === 1 ? 0 : 11 - resto;
        }
        return [dig1, dig2];
    }
    imprimirMensagem({ numero, id, tamanho, f }) {
        let resposta = document.getElementById(id);
        if (numero.length === tamanho) {
            let [dv1, dv2] = f(numero.substring(0, tamanho - 2));
            if (dv1 !== parseInt(numero[tamanho - 2]) || dv2 !== parseInt(numero[tamanho - 1])) {
                resposta.textContent = "Documento inválido!";
                resposta.className = "text-danger";
            } else {
                resposta.textContent = "Documento válido!";
                resposta.className = "text-primary";
            }
        } else if (numero.length === tamanho - 2) {
            let [dv1, dv2] = f(numero);
            resposta.textContent = `Os dígitos verificadores são ${dv1}${dv2}`;
            resposta.className = "text-success";
        }
    }
    validar(ev) {
        ev.preventDefault();
        let cpf = document.getElementById("cpf");
        if (cpf.value !== "") {
            this.imprimirMensagem({ numero: cpf.value, id: "cpfMessage", tamanho: 11, f: this.cpfDV });
        }
        let cnpj = document.getElementById("cnpj");
        if (cnpj.value !== "") {
            this.imprimirMensagem({ numero: cnpj.value, id: "cnpjMessage", tamanho: 14, f: this.cnpjDV });
        }
        let eleitor = document.getElementById("eleitor");
        if (eleitor.value !== "") {
            this.imprimirMensagem({ numero: eleitor.value, id: "eleitorMessage", tamanho: 12, f: this.tituloDV });
        }
    }
    init() {
        let cpf = document.getElementById("cpf");
        cpf.focus();
        let submeter = document.getElementById("form");
        submeter.onsubmit = this.validar.bind(this);
    }
}
let gui = new GUI();
gui.init();