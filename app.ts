interface Veiculo {
    nome: string;
    placa: string;
    entrada: Date | string;

}

(function (){
    const $ =  (query:string): HTMLInputElement | null=> document.querySelector(query);

    function calcTime(mil: number): String{
        const minu = Math.floor(mil /60000)
        const seg = Math.floor(minu % 60000) / 1000;
        return `${minu}m e ${seg}s`;
    }

    function patio(){
        function ler(): Veiculo[]{
            return localStorage.patio ? JSON.parse(localStorage.patio): [];
        }
        function salvar(veiculos: Veiculo[]){
            localStorage.setItem("patio",JSON.stringify(veiculos));
        }
        function adicionar(veiculo : Veiculo, salvo? : boolean){
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${veiculo.nome}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td>
                    <button class="delete" data-placa="${veiculo.placa}"> X </button>
                </td>
            `;
            row.querySelector(".delete")?.addEventListener("click",function(){
                remover(this.dataset.placa)
            })

            $("#patio")?.appendChild(row);

            if(salvo) salvar([...ler(),veiculo]);
        }
        function remover(placa:string){
            const {entrada,nome} = ler().find(veiculo => veiculo.placa == placa);
            const temp = calcTime(new Date().getTime() - new Date(entrada).getTime());
            if(!confirm(`O veiculo ${nome} permaneceu por ${temp}. Deseja encerrar?`)) return;
            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            render();
        }
    
        function render(){
            $("#patio")!.innerHTML = "";
            const patio = ler();
            if(patio.length){
                patio.forEach((veiculo) => adicionar(veiculo))
            }
        }
        return {ler,adicionar,remover,salvar,render};
    }


    patio().render();
    $('#cadastrar')?.addEventListener("click", () =>{
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;
        if(!nome || !placa){
            alert("Nome e Placa sao obrigatorios");
            return;
        }
        patio().adicionar({ nome, placa, entrada:new Date().toISOString() },true);
    })
})();