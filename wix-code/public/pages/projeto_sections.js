import { getSecProjs } from "backend/projects/projects.jsw";

$w.onReady(function () {
    $w("#storeBtn1").link = "/projetos?sec=tendencias";
    $w("#storeBtn2").link = "/projetos?sec=descontos";
    $w("#storeBtn3").link = "/projetos?sec=em-breve";
    $w("#storeBtn4").link = "/projetos?sec=mais-adquiridos";
    $w("#storeBtn5").link = "/projetos?sec=explorar";

    getSecProjs("novidades", 6).then((res) => {
        $w("#projetos1").loadData(res.projs, res.profs);
    });
    getSecProjs("descontos", 6).then((res) => {
        $w("#projetos2").loadData(res.projs, res.profs);
    });
});

// function loadgames() {
//     wixData.query("JogosdoCrate").eq("estado", "publico").ne("idConta", conta._id).limit(6).skip(Number((Math.random() * 20).toFixed(0))).descending("nLikes").descending("classificacao").find().then((res) => {
//         $w("#repeater8").data = res.items;
//         $w("#repeater8").forEachItem(($w, itemData) => {
//             $w("#btn").link = "/projetos/" + itemData.shortId;
//         });
//         $w("#jogos").refresh();
//         $w("#jogos").show();
//         $w("#loading2").hide();
//     });
//     /*
//     let today = new Date();
//     let d1 = new Date(today.getTime() + 75 * 60 * 60 * 1000);
//     $w("#dataset17").setFilter(wixData.filter().eq("estado", "publico").and(wixData.filter().ne("cadoautor", conta._id)
//     	.lt("datahoratualizacao", d1).or(wixData.filter().lt("_createdDate", d1))).not(wixData.filter().contains("cadownloads", conta._id))).then(() => {
//     	$w("#jogos1").refresh();
//     	$w("#jogos1").show();
//     	$w("#loading2").hide();
//     });*/
// }

// function test() {
//     let games = [
//         "bbK9N", "22MXR", "m2fBl", "8pJXN", "WmgCL", "Fn8c4", "N8cv7", "B14hS", "TkzDh", "0XK0N", "1wQ2l", "9BnJQ", "8hK3z", "THg13", "33V6s", "Fng3K", "qxY68", "6KX6m", "mQ9rQ", "vYtSv", "grbl2", "GXTVS",
//         "KZq6D", "ZkM9B", "tkrwF", "vLcx7", "177Xf", "7jGyV", "SlhDC", "PyJd2", "WlkGK", "zRpHD", "HBrM7", "yw1gs", "CM8nx", "pyNNr", "f3wk9", "Xq16G", "QX0Ws", "0K2yx", "XCR4P", "KSBCP", "k8Cl9", "zyXPQ",
//         "qKvkm", "y6YPR", "zJGJp", "C8TSV", "c1RhD", "GW4BT", "zJGJp", "jrjYR", "H4H3K", "sdHV1", "ZX4bG", "JVbzK", "8Svq4", "YV8kG", "1XCWv", "bmkgc", "wH0PW", "Wdq2z", "d5sPn", "vGLLm", "ptqw5", "mZd5W",
//         "CZW9h", "sn7sG", "0QDkj", "BKtt4", "z0mpl", "9NzTN", "bz9xN", "mx92q", "700ll", "MRrmQ", "3BYB5", "wMGcQ", "zGCqj", "x2kqr", "cY592", "sdWMy", "7Hz4q", "X2YXk", "P2CFG", "sH769", "sHNYB", "cyZDK",
//         "KSY6L", "gzt1W", "h8j74", "GXTVS", "nH1p4", "P14Gl"
//     ];
//     wixData.query("JogosdoCrate").hasSome("shortId", games).limit(900).find().then((res) => {
//         let r = res.items;
//         r = r.filter(e => e.estado !== "publico");
//         console.log(r);
//     });
// }

// function loadgames2() {
//     //test();
//     let games = [
//         "bbK9N", "22MXR", "m2fBl", "8pJXN", "WmgCL", "Fn8c4", "N8cv7", "B14hS", "TkzDh", "0XK0N", "1wQ2l", "9BnJQ", "8hK3z", "THg13", "33V6s", "Fng3K", "qxY68", "6KX6m", "mQ9rQ", "vYtSv", "grbl2", "GXTVS",
//         "KZq6D", "ZkM9B", "tkrwF", "vLcx7", "177Xf", "7jGyV", "SlhDC", "PyJd2", "WlkGK", "zRpHD", "HBrM7", "yw1gs", "CM8nx", "pyNNr", "f3wk9", "Xq16G", "QX0Ws", "0K2yx", "XCR4P", "KSBCP", "k8Cl9", "zyXPQ",
//         "qKvkm", "y6YPR", "zJGJp", "C8TSV", "c1RhD", "GW4BT", "zJGJp", "jrjYR", "H4H3K", "sdHV1", "ZX4bG", "JVbzK", "8Svq4", "YV8kG", "1XCWv", "bmkgc", "wH0PW", "Wdq2z", "d5sPn", "vGLLm", "ptqw5", "mZd5W",
//         "CZW9h", "sn7sG", "0QDkj", "BKtt4", "z0mpl", "bz9xN", "mx92q", "700ll", "MRrmQ", "3BYB5", "wMGcQ", "zGCqj", "x2kqr", "cY592", "sdWMy", "7Hz4q", "X2YXk", "P2CFG", "sH769", "sHNYB", "cyZDK",
//         "KSY6L", "gzt1W", "h8j74", "GXTVS", "nH1p4"
//     ].sort(() => 0.5 - Math.random()).slice(0, 2);
//     wixData.query("JogosdoCrate").eq("estado", "publico").descending("classificacao").hasSome("shortId", games).limit(2).find().then((res) => {
//         $w("#repeater9").data = res.items;
//         $w("#repeater9").forEachItem(($w, itemData) => {
//             $w("#btn2").link = "/projetos/" + itemData.shortId;
//         });
//         $w("#jogos2").refresh();
//         $w("#jogos2").show();
//         //$w("#loading2").hide();
//     });
// }

// export function container12_mouseIn(event, $w) {
//     $w("#cover").show();
// }

// export function container12_mouseOut(event, $w) {
//     $w("#cover").hide();
// }