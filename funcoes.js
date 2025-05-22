const os = require('os');

class Funcoes {
    async sistemaOperacional() {
        return JSON.stringify({
            sistema: os.type(),
            plataforma: os.platform(),
            arquitetura: os.arch(),
            hostname: os.hostname(),
            uptime: os.uptime(),
            memoria_total_gb: (os.totalmem() / (1024 ** 3)).toFixed(2),
            memoria_livre_gb: (os.freemem() / (1024 ** 3)).toFixed(2),
            cpus: os.cpus().length,
        })
    }
    async pessoa(req) {

        let body = JSON.parse(req)

        let erro = false
        let formErro = {}

        if (!body.nome) {
            erro = true
            formErro.nome = "Nome obrigatório"
        }

        if (!body.email) {
            erro = true
            formErro.email = "Email obrigatório"
        }
        if (erro) {
            return { obj: formErro, codigo: 400 }
        }
        return { obj: body, codigo: 200 }
    }

}

module.exports = Funcoes; 
