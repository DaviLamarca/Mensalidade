const prompt = require("prompt-sync")()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function middle() {
    const total = await prisma.mensalidade.count();
    if (total == 0) {
        await removerIDS()
    }
}

function mensagem() {
    console.clear()
    console.log("  ----Mensalidade----\n" +
        "  \x1b[32m1\x1b[0m - \x1b[32mAdicionar Mensalidade\x1b[0m\n" +
        "  \x1b[32m2\x1b[0m - Listar Mensalidades\n" +
        "  \x1b[32m3\x1b[0m - \x1b[31mRemover\x1b[0m\n" +
        "  \x1b[32m4\x1b[0m - \x1b[33mPagar\x1b[0m\n" +
        "  \x1b[32mby DaviLamarca\x1b[0m\n" +
        "  --------------------\n");
}

async function main() {
    middle()
    mensagem()
    let resposta = prompt("Escolha uma opção (1 a 5):  ");
    switch (resposta) {
        case "1":
            await adicionar()
            break
        case "2":
            await listar()
            break
        case "3":
            await remover()
            break
        case "4":
            await pagar()
            break
        default:
            console.log("Saindo...")
    }
    await prisma.$disconnect()
}
main()

async function adicionar() {

    let descricao = prompt("Descrição: ")
    let valor = prompt('Valor (ex: 150.00): ')

    if (valor === "sair") {
        console.clear()
        await main()
    }
    let vencimentoStr = prompt('Vencimento (yyyy-mm-dd): ')

    try {

        valor = parseInt(valor)
        let vencimento = new Date(vencimentoStr)
        let mensalidade = await prisma.mensalidade.create({
            data: {
                descricao,
                valor,
                vencimento
            }
        })

        console.log("Mensalidade criada:", mensalidade)

        setTimeout(() => {
            console.clear();
            main()
        }, 3000)

    } catch (error) {
        console.log("\x1b[32m\x1b[0m\x1b[32mErro em salvar: \x1b[0m\n" + error);
        setTimeout(() => {
            console.clear()
            main()
        }, 2000)
    }

}

async function listar() {

    let mes = new Date().getMonth()
    let ano = new Date().getFullYear()

    let inicio = new Date(ano, mes, 1)
    let fim = new Date(ano, mes + 1, 1)

    const valor = await prisma.mensalidade.findMany({
        where: {
            vencimento: {
                gte: inicio,
                lte: fim
            }
        }
    })


    let valor_total = 0
    for (let i = 0; i < valor.length; i++) {
        const m = valor[i]
        const dataFormatada = m.vencimento.toLocaleDateString('pt-BR')
        console.log(`${m.descricao} - R$${m.valor} - Vence em: ${dataFormatada}`)
        if (m.valor) {
            valor_total += m.valor
        }
    }

    console.log("Você deve: ", valor_total);
    setTimeout(() => {
        console.clear();
        main()
    }, 3000)
}

async function remover() {
    let valor = await prisma.mensalidade.findMany()
    for (let i = 0; i < valor.length; i++) {
        console.log(`${valor[i].id} - ${valor[i].descricao}`);
    }
    let resposta = parseInt(prompt("Qual o ID que você deseja excluir: "))
    try {

        let remover = await prisma.mensalidade.delete({
            where: {
                id: resposta
            }
        })
        console.log(remover);
    } catch (error) {
        console.log("Erro em deletar ID");
    }
    setTimeout(() => {
        console.clear();
        main()
    }, 3000)
}
async function removerIDS() {

    await prisma.$executeRawUnsafe(
        `DELETE FROM sqlite_sequence WHERE name = 'Mensalidade';`
    )
    console.log("Todos os IDS resetados com sucesso!");
    setTimeout(() => {
        console.clear();
        main()
    }, 3000)

}

async function pagar() {
    let valor = await prisma.mensalidade.findMany()
    for (let i = 0; i < valor.length; i++) {
        let m = valor[i]
        console.log(`${m.id} - ${m.descricao}`);
    }
    let resposta = prompt(`Qual o ID que você deseja pagar: `)
    let respostaInt = parseInt(resposta)

    let find = await prisma.mensalidade.findMany({
        where: {
            id: respostaInt
        }
    })

    let data = find[0].vencimento
    let novaData = new Date(data)

    novaData.setMonth(novaData.getMonth() + 1)

    let pagar = await prisma.mensalidade.update({
        where: {
            id: respostaInt
        },
        data: {
            vencimento: novaData
        }
    })
    console.log("Já que foi pago, foi adicionado 1 mês");

    setTimeout(() => {
        console.clear
        main()
    }, 3000)
    console.log(pagar);
}