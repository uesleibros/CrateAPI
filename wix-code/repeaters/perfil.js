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
export function loadData(profiles) {
    $w("#repeater1").data = profiles;
    $w("#repeater1").forEachItem(($item, itemData) => {
        $item("#imagemPerfil").src = itemData.imagemPerfil
        $item("#btnNome").label = itemData.nome;
        $item("#seguidores").text = itemData.numeroSeguidores + " seguidores";
        $item("#btnCover").link = "/perfil/" + itemData.caminhoPerfil;
    });
    $widget.props.isLoading = false;
    refreshLoading();
}