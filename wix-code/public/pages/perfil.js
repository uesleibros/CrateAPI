import { getProfile } from "backend/accounts/profiles.jsw";
import { profIsFollowing, profFollow, profUnfollow } from "backend/accounts/profile.jsw";
import { getProfileProjects } from "backend/projects/projects.jsw";
import wixWindow from 'wix-window';

let sData;
let prof;

$w.onReady(function () {
    $w("#accSession").onReady((res) => {
        sData = res.data;
        const data = wixWindow.getRouterData();
        getProfile(data.profId).then(async (profRes) => {
            prof = profRes;
            // profIsFollowing(sData, prof._id).then((isFollowing) => {

            $w("#nome").text = prof.nome;
            $w("#imagemPerfil").src = prof.imagemPerfil;
            $w("#ilustracao").background.src = prof.ilustracaoPerfil;
            $w("#seguidores").text = prof.numeroSeguidores + " seguidor" + (prof.numeroSeguidores == 1 ? "" : "es");

            if (sData.accountId != prof._id) {
                $w("#btnTransferCredits").show();
                // if (isFollowing)
                //     $w("#btnUnfollow").show();
                // else
                //     $w("#btnFollow").show();
            }

            $w("#pagination1").currentPage = 1;
            loadProjects();
            // });
        });
    });
});

function loadProjects() {
    getProfileProjects(prof._id, 12, $w("#pagination1").currentPage).then((projs) => {
        $w("#projs").setData({ "projetos": projs.projs, "contas": [prof] });
        $w("#pagination1").totalPages = projs.pageCount;
    });
}

export function pagination1_click(event) {
    loadProjects();
}

export function btnFollow_click(event) {
    $w("#btnFollow").disable();
    $w("#loadingFollow").show();
    profFollow(sData, prof._id).then((res) => {
        if (res.status == 1) {
            $w("#loadingFollow, #btnFollow").hide();
            $w("#btnFollow").enable();
            $w("#btnUnfollow").show();
        } else if (res.status == 0) {
            console.error("Unexpected error", res.error);
        }
    });
}

export function btnUnfollow_click(event) {
    $w("#btnUnfollow").disable();
    $w("#loadingFollow").show();
    profUnfollow(sData, prof._id).then((res) => {
        if (res.status == 1) {
            $w("#loadingFollow, #btnUnfollow").hide();
            $w("#btnUnfollow").enable();
            $w("#btnFollow").show();
        } else if (res.status == 0) {
            console.error("Unexpected error", res.error);
        }
    });
}

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function btnTransferCredits_click(event) {
    wixWindow.openLightbox("Enviar Credits", { session: sData, profId: prof._id })
}