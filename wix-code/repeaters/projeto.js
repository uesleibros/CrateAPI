$w.onReady(function () {

});

$widget.onPropsChanged((oldProps, newProps) => {
    refreshLoading();
});

function refreshLoading() {
    if ($widget.props.isLoading) {
        $w("#repeater1").hide();
        $w("#loading").show();
    } else {
        $w("#repeater1").show();
        $w("#loading").hide();
    }
}

/**
 * @function
 * @description Function description
 * @param {any} projects
 * @param {any} profiles
 * @returns {void}
 * See http://wix.to/VaEzgUn for more information on widget API functions
 */
export function loadData(projects, profiles) {
    $w("#repeater1").data = projects;
    $w("#repeater1").forEachItem(($item, itemData, index) => {
        $item("#icone").src = itemData.icone
        $item("#capa").src = itemData.capa ? itemData.capa : itemData.recursosGraficos.filter(e => e.type == "image")[0].src;
        $item("#btnTitulo").label = itemData.titulo;
        if (profiles.filter(e => e._id == itemData.idAutor).length == 0) {
            console.error("Account " + itemData.idAutor + " not found for project " + itemData._id);
            return;
        }
        $item("#btnAutor").label = profiles.filter(e => e._id == itemData.idAutor)[0].nome;
        $item("#btnCover").link = "/projetos/" + itemData.idCurto;
        $item("#classificacao").text = Number(itemData.classificacaoFinal).toFixed(1).replace(".", ",");
        if (itemData.lancamento == 1) {
            if (itemData.preco == 0 && !itemData.desconto) {
                $item("#preco").text = "GRATUITO";
            } else {
                $item("#preco").text = Number(itemData.preco).toFixed(2).replace(".", ",") + " C";
                if (itemData.desconto) {
                    $item("#btnDesconto").label = "-" + itemData.desconto + "%";
                    // $item("#precoOldBtn").label = Number(itemData.precoCache).toFixed(2).replace(".", ",") + " C";
                    $item("#btnDesconto").show();
                }
            }
        } else if (itemData.lancamento == 0) {
            $item("#preco").text = "EM BREVE";
        }
        if (itemData.dataAtualizacao >= new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)) {
            $item("#atualizado").show();
        } else {
            $item("#atualizado").hide();
        }
    });
    $widget.props.isLoading = false;
    refreshLoading();
}