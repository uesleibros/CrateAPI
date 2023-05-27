import wixLocation from 'wix-location';
import wixAnimations from 'wix-animations';
import wixWindow from 'wix-window';
import { local, session } from 'wix-storage';
import { formatCredits, formatDate, formatTime, ago } from "public/tools.js";
import { checkAdm } from 'backend/accounts/session.jsw';
import { postSvc } from "public/tools.js";
import { readNotifications, getAccNotifications } from "backend/accounts/notifications.jsw";

let timeline = wixAnimations.timeline();

$w.onReady(async function () {
    if (wixLocation.path[0] == "testing-perms") {
        $w("#headerLoadingAcc").hide();
        return;
    }

    // const adm = await checkAdm(local.getItem("adm"));
    // if (!adm) {
    //     if (wixLocation.path[0] != "manutencao") wixLocation.to("/manutencao");
    //     return;
    // }

    if (wixWindow.rendering.env === "browser") {
        try {
            const sCache = session.getItem("sessionCache");
            if (sCache == null) {
                const data = await postSvc("session", { sid: local.getItem("session_id"), at: local.getItem("acc_token") });
                local.setItem("acc_token", data.session.accessToken);
                loadAcc(data, false);
            } else {
                loadAcc(JSON.parse(sCache), true);
            }
        } catch (e) {
            console.log("SESSION FAILED", e);
            switch (e.error) {
            case "cs_not_logged":
                checkOLP();
                break;
            default:
                logout();
            }
        }
    }

    wixWindow.getBoundingRect().then((w) => {
        timeline.add($w("#accountbox, #notbox, #boxPublish"), {
            "duration": 0,
            "x": (980 - w.window.width) / 2
        });
        timeline.play();
    });

    // if (local.getItem("readmsg1") != "18") wixWindow.openLightbox("msg1");

    $w("#accBtnConta, #accBtnPerfil, #accBtnAreaCriador").onClick(() => {
        hidehboxes();
    });

    // Remove old cookies
    if (local.getItem("loggedca") !== null) local.removeItem("loggedca");
    if (local.getItem("logged_ca") !== null) local.removeItem("logged_ca");

    // Bottom warning
    if (local.getItem("btmmsgread") !== "true") $w("#bottomwarning").show();

    if (wixLocation.prefix == "projetos" && wixLocation.path.length == 0) {
        $w("#menuButton1").link = undefined;
        $w("#menuButton1").disable();
    } else {
        $w("#menuButton1").enable();
        $w("#menuButton1").link = "/projetos";
    }
    if (wixLocation.path[0] == "comunidade") {
        $w("#menuButton2").link = undefined;
        $w("#menuButton2").disable();
    } else {
        $w("#menuButton2").enable();
        $w("#menuButton2").link = "/comunidade";
    }
    // if (wixLocation.path[0] == "sobre") {
    //     $w("#menuButton3").link = undefined;
    //     $w("#menuButton3").disable();
    // } else {
    //     $w("#menuButton3").enable();
    //     $w("#menuButton3").link = "/sobre";
    // }
    $w("#accountbox, #notbox").hide();
});

function loadAcc(data, isCache = false) {
    session.setItem("sessionCache", JSON.stringify(data));
    // sData = { accountId: data.accountId, sessionId: data.sessionId, accessToken: data.accessToken };
    // conta = data.account;
    if ($w("#accSession").isLoaded) {
        $w("#accSession").loadSession(data);
        next();
    } else {
        $w("#accSession").onLoaded(() => {
            $w("#accSession").loadSession(data);
            next();
        });
    }

    function next() {
        console.log("SESSION LOADED" + (isCache ? " (cached)" : ""), $w("#accSession").getAccount()._id, $w("#accSession").getAccount().nome);
        $w("#containfo1").text = "ID curto: " + $w("#accSession").getAccount().idCurto;
        $w("#accCredits").text = formatCredits($w("#accSession").getAccount().credits, true);
        $w("#accName").text = $w("#accSession").getAccount().nome;
        $w("#headerAccProfPic").src = $w("#accSession").getAccount().imagemPerfil;
        $w("#accBtnPerfil").link = "/perfil/" + $w("#accSession").getAccount().caminhoPerfil;
        $w("#headerLoadingAcc").hide();
        $w("#notloggedbox").hide();
        $w("#loggedbox").show();

        const notfs = data.notifications;
        if (data.unreadNotifications > 0) {
            $w("#headerNotfCount").text = String(data.unreadNotifications);
            $w("#headerNotfCountBox").show();
        }
    }
}

// check Optional Login Page
function checkOLP() {
    if (wixLocation.prefix) {
        if (!["ativar-conta"].includes(wixLocation.prefix)) {
            session.setItem("reqlogpag", wixLocation.url);
            wixLocation.to("/login");
            return;
        }
    } else {
        if (!["criar-conta", "login", "forum", "post", "ativar-conta", "solicitar-redefinicao-senha", "regras", "termos-condicoes",
                "redefinir-senha", "recuperar-id-curto", "testpag", "crate-mobile-connect", "api", "recuperar", "ajuda"
            ].includes(wixLocation.path[0])) {
            session.setItem("reqlogpag", wixLocation.url);
            wixLocation.to("/login");
            return;
        }
    }
    $w("#notloggedbox").show();
    $w("#headerLoadingAcc").hide();
}

export function logout() {
    $w("#notloggedbox").show();
    $w("#loggedbox").hide();
    local.removeItem("session_id");
    local.removeItem("acc_token");
    wixLocation.to("/login");
}

export function search_keyPress(event) {
    if (event.key === "Enter" && $w("#headerInputSearch").value.length > 0) {
        if (wixLocation.prefix === "projetos") {
            wixLocation.to("https://pptgamespt.wixsite.com/crate/projetos/pesquisar?q=" + String($w("#headerInputSearch").value).replace(/ /g, "+"));
        } else {
            wixLocation.to("/projetos/pesquisar?q=" + String($w("#headerInputSearch").value).replace(/ /g, "+"));
        }
    }
}

let curnot = 0;

/*function readnotifications() {
	$w("#dataset16").setCurrentItemIndex(curnot).then(() => {
		let lido;
		if ($w("#dataset16").getCurrentItem().lido) { lido = JSON.parse($w("#dataset16").getCurrentItem().lido); } else { lido = []; }
		lido.push($w("#curaccount").getCurrentItem()._id);
		$w("#dataset16").setFieldValue("lido", JSON.stringify(lido));
		if (curnot === $w("#dataset16").getTotalCount() - 1) { $w("#dataset16").save(); } else {
			curnot++;
			readnotifications();
		}
	});
}*/

function hidehboxes() {
    $w("#notbox").hide();
    $w("#accountbox").hide();
    $w("#boxPublish").hide();
}

export function bottomwarning_click(event, $w) {
    $w("#bottomwarning").hide();
    local.setItem("btmmsgread", "true");
}

export function btnPublishProject_click(event) {
    $w("#boxPublish").hide();
    wixWindow.openLightbox("Criar projeto", $w("#accSession").getSession());
}

/**
 *	Adds an event handler that runs when the element is clicked.
 *	 @param {$w.MouseEvent} event
 */
export function headerBtnAcc_click(event) {
    if ($w("#accountbox").hidden) {
        hidehboxes();
        $w("#accountbox").show();
    } else { $w("#accountbox").hide(); }
}

/**
 *	Adds an event handler that runs when the element is clicked.
 *	 @param {$w.MouseEvent} event
 */
export function headerBtnNotfs_click(event) {
    if ($w("#notbox").hidden) {
        hidehboxes();
        $w("#notbox").show();
        $w("#headerNotfCountBox").hide();
        getAccNotifications($w("#accSession").getSession(), 5).then((notfs) => {
            readNotifications($w("#accSession").getSession()).then(() => {
                $w("#repNotfs").data = notfs;
                $w("#repNotfs").forEachItem(($item, itemData) => {
                    $item("#notfText").text = itemData.notificacao;
                    $item("#notdatahora").text = ago(itemData._createdDate);
                    if (itemData.link) {
                        $item("#notBtn").link = itemData.link;
                        $item("#notBtn").target = "_self";
                    }
                    if (itemData.imagem)
                        $item("#notfImage").src = itemData.imagem;
                    else
                        $item("#notfImage").hide();
                    if (itemData.lido)
                        $item("#notfNew").hide();
                    else
                        $item("#notfNew").show();
                });
                $w("#repNotfs").show();
                $w("#notfsLoading").hide();
            });
        });
        /*//$w("#nnot").hide();
        //$w("#dataset16").setFilter(wixData.filter().contains("idConta", $w("#curaccount").getCurrentItem()._id).not(wixData.filter().contains("lido", $w("#curaccount").getCurrentItem()._id))).then(() => {
        wixData.query("Notificacoes").contains("idConta", conta._id)
            .not(wixData.query("Notificacoes").contains("lido", conta._id)).find().then((res) => {
                if (res.items.length > 0) {
                    curnot = 0;
                    //readnotifications();
                    for (let i = 0; i < res.items.length; i++) {
                        if (res.items[i].lido) { res.items[i].lido = JSON.parse(res.items[i].lido); } else { res.items[i].lido = []; }
                        res.items[i].lido.push(conta._id);
                        res.items[i].lido = JSON.stringify(res.items[i].lido);
                    }
                    wixData.bulkUpdate("Notificacoes", res.items);
                }
            });*/
    } else {
        $w("#notbox").hide();
        $w("#headerBtnNotfs").enable();
    }
}

/**
 *	Adds an event handler that runs when the element is clicked.
 *	 @param {$w.MouseEvent} event
 */
export function headerBtnCreate_click(event) {
    if ($w("#boxPublish").hidden) {
        hidehboxes();
        $w("#boxPublish").show();
    } else {
        $w("#boxPublish").hide();
    }
}

/**
 *	Adds an event handler that runs when the element is clicked.
 *	 @param {$w.MouseEvent} event
 */
export function accBtnLogout_click(event) {
    logout();
}

/**
 *	Adds an event handler that runs when the element is clicked.
 *	 @param {$w.MouseEvent} event
 */
// export function headerBtnSearch_click(event) {
//     if ($w("#headerSearch").hidden) {
//         searchAnim.play();
//         $w("#headerSearch").show();
//     } else {
//         searchAnim.reverse();
//         searchAnim.onReverseComplete(() => {
//             $w("#headerSearch").hide();
//         });
//     }
// }