import wixWindow from 'wix-window';
import wixLocation from 'wix-location';
import wixStorage from 'wix-storage';
import wixSite from 'wix-site';
import { getProject } from "backend/projects/projects.jsw";
import { projWishlist } from "backend/projects/project.jsw";
import { downloadProject } from "backend/projects/download.jsw";
import { preRegisterProject } from "backend/projects/pre-register.jsw";
import { joinProjChan } from "backend/projects/channels.jsw";
import { projPublishRating, projRemoveRating, projGetRatings } from "backend/projects/rating.jsw";
import { getProfile } from "backend/accounts/profiles.jsw";
import { getAccount } from "backend/accounts/account_info.jsw";
import {
    formatCredits,
    formatDate,
    ago,
    formatSize,
    getAgeRatingIcon,
    checkAgeRatingReq,
    getContentClassDesc,
    getCategoriasList,
    getIdiomasList
} from "public/tools.js";
import { edjsHTML } from "public/edjs-parser.js";

let conta;
let sData;
let proj;
let projWarns;

let media;
let mediaPageCount;
let mediaCurPage = 0;

$w.onReady(function () {
    $w("#accSession").onReady((res) => {
        sData = res.data;
        console.log(sData);
        getAccount(sData).then((acc) => {
            conta = acc;
            const data = wixWindow.getRouterData();
            wixSite.prefetchPageResources({ "lightboxes": ["Mensagem"] });
            getProject(sData, data.projId, true).then(async (projRes) => {
                proj = projRes;
                console.log(proj);

                media = proj.recursosGraficos;
                mediaPageCount = Math.ceil(proj.recursosGraficos.length / 5);
                media.forEach((e, i) => e._id = String(i));
                refreshMediaPages();
                // $w("#repImgs").data = media;
                // $w("#repImgs").forEachItem(($item, itemData, index) => {
                //     if (index === 0) $item("#btnImg").disable();
                //     if (itemData.type === "image") {
                //         $item("#img").src = itemData.src;
                //     } else if (itemData.type === "video") {
                //         $item("#img").src = "http://i3.ytimg.com/vi/" + itemData.src.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)[2] + "/hqdefault.jpg"; // maxresdefault
                //     }
                // });

                if (proj.estado == 0 && proj.idAutor != conta._id) {
                    wixLocation.to("/nao-encontrado");
                    return;
                } else if (proj.estado == 0 && proj.lancamento == undefined) {
                    wixLocation.to("/" + proj.idCurto + "/editar");
                    return;
                }

                if (proj.estado == 0 && proj.lancamento != undefined && proj.idAutor == conta._id) {
                    $w("#projPreview").expand();
                }

                if (proj.faixaEtaria >= 12) {
                    let req = false;
                    if (wixStorage.local.getItem("cache_dob")) {
                        req = checkAgeRatingReq(proj.faixaEtaria, new Date(Number(wixStorage.local.getItem("cache_dob"))));
                    }
                    if (!req) {
                        const res = await wixWindow.openLightbox("Aviso faixa etaria", {
                            noPerm: !!wixStorage.local.getItem("cache_dob"),
                            faixaEtaria: proj.faixaEtaria,
                            classCont: proj.classificacaoConteudo
                        });
                        if (res != "success") {
                            wixLocation.to("/projetos");
                            return;
                        }
                    }
                }

                $w("#title").text = proj.titulo;
                if (proj.capa) {
                    $w("#projCover").src = proj.capa;
                } else {
                    $w("#projCover").src = proj.recursosGraficos.filter(e => e.type == "image")[0].src;
                    $w("#projIcon").src = proj.icone;
                    $w("#projIcon").show();
                }
                $w("#columnStrip1").background.src = proj.recursosGraficos.filter(e => e.type == "image")[0].src;

                $w("#shortDesc").text = proj.descricao.length > 100 ? proj.descricao.text.substr(0, 100) + "..." : proj.descricao.text;

                if (proj.idAutor == conta._id) {
                    $w("#btnEditProj").link = "/projetos/" + proj.idCurto + "/editar";
                    $w("#btnEditProj").expand();
                } else {
                    if (conta.tag == "Moderador") {
                        $w("#btnModerate").expand();
                    }
                }

                if (conta.listaDesejos) {
                    $w("#btnListaDesejosRem").show();
                } else {
                    $w("#btnListaDesejosAdd").show();
                }

                // Sobre
                if (proj.lancamento == 1) {
                    if (proj["canal" + proj.mainChannel].novidades) {
                        $w("#projNovidades").text = proj["canal" + proj.mainChannel].novidades;
                        $w("#projBoxNovidades").expand();
                    }
                }

                const edjsParser = edjsHTML({
                    delimiter: function (block) {
                        return `<hr>`;
                    },
                    warning: function (block) {
                        return `<div style="background-color: #fffc9c; padding: 10px;"><div style="font-size: 16px; margin-bottom: 5px;"><b>${block.data.title}</b></div>${block.data.message}</div>`;
                    },
                    table: function (block) {
                        const rows = block.data.content.map((row) => {
                            return `<tr>${row.reduce(
                                (acc, cell) => acc + `<td>${cell}</td>`,
                                ""
                            )}</tr>`;
                        });
                        return `<table><tbody>${rows.join("")}</tbody></table>`;
                    }
                });

                let html = edjsParser.parse(proj.descricao.data);
                $w("#descricao").html = html.join("");

                getProfile(proj.idAutor).then((author) => {
                    $w("#authorBtn").label = author.nome;
                    $w("#authorBtn").link = "/perfil/" + author.caminhoPerfil;
                    $w("#authorPic").src = author.imagemPerfil;
                }).catch((e) => {
                    console.error(e);
                });

                if (proj.lancamento == 0) {
                    $w("#getTitle").text = "Lançamento: " + (proj.dataLancamento ? proj.dataLancamento : "Em breve");
                    $w("#infoGet").text = "O projeto ainda não foi lançado no Crate.";
                    $w("#price").collapse();
                    if (proj.preRegistado) {
                        $w("#btnGet").label = "REMOVER PRÉ-REGISTO";
                    } else {
                        $w("#btnGet").label = "PRÉ-REGISTO";
                    }
                    if (proj.idAutor != conta._id) {
                        $w("#btnGet").enable();
                    }
                    $w("#loadingGet").hide();
                } else if (proj.lancamento == 1) {
                    if (proj.mainChannel == "producao") {
                        $w("#infoGet").text = "Versão " + proj["canal" + proj.mainChannel].nomeVersao;
                    } else {
                        $w("#infoGet").text = "Acesso Antecipado (" + { "beta": "Beta", "alpha": "Alpha" } [proj.mainChannel] + " " + proj["canal" + proj.mainChannel].nomeVersao + ")";
                    }
                    if (proj.preco === 0) {
                        $w("#getTitle").text = "Adquirir " + proj.titulo;
                        $w("#price").text = "Gratuito";
                        $w("#btnGet").label = "DOWNLOAD";
                        $w("#btnGet").link = proj["canal" + proj.mainChannel].download;
                        $w("#loadingGet").hide();
                        $w("#btnGet").enable();
                    } else {
                        if (proj.adquirido || proj.idAutor == conta._id) {
                            $w("#getTitle").text = "Baixar " + proj.titulo;
                            $w("#btnGet").label = "DOWNLOAD";
                            $w("#btnGet").link = proj["canal" + proj.mainChannel].download;
                            // $w("#infoGet").text = "Comprou este projeto.";
                            $w("#loadingGet").hide();
                            $w("#btnGet").enable();
                        } else {
                            $w("#getTitle").text = "Comprar " + proj.titulo;
                            $w("#btnGet").label = "COMPRAR";
                            $w("#loadingGet").hide();
                            $w("#btnGet").enable();
                        }
                        if (proj.desconto > 0) {
                            $w("#price").text = formatCredits(proj.preco);
                            $w("#priceOld").html = '<p class="font_8" style="text-align: right; font-size: 16px;"><span style="font-family:wfont_89e32c_1bb3d47dcc7b404c8bb564dce7086294,wf_1bb3d47dcc7b404c8bb564dce,orig_roboto;"><span class="color_14"><span style="font-family:wfont_89e32c_b58e5420b2624522b422d911c2ccaec6,wf_b58e5420b2624522b422d911c,orig_roboto_medium;"><span style="font-size:16px;"><strike>' + formatCredits(proj.precoCache) + '</strike></span></span></span></span></p>';
                            $w("#discount").text = "-" + String(proj.desconto) + "%";
                            $w("#priceOld").expand();
                            $w("#discountBox").show();
                        } else {
                            $w("#price").text = formatCredits(proj.preco);
                        }
                    }
                }

                if (proj.lancamento == 0) {
                    $w("#qinfoLeft").text = "Lançamento:\nPré-registos:";
                    $w("#qinfoRight").text = (proj.dataLancamento ? proj.dataLancamento : "Em breve") + "\n" + proj.numeroPreRegistos;
                } else if (proj.lancamento == 1) {
                    const rating = proj.classificacaoTotal == 0 ? "0,0" : Number(proj.classificacaoTotal / proj.numeroClassificacoes).toFixed(1).replace(".", ",");
                    $w("#qinfoLeft").text = "Classificação:\n" + (proj.preco == 0 ? "Downloads:" : "Compras:");
                    $w("#qinfoRight").text = rating + "⋆ (" + proj.numeroClassificacoes + (proj.numeroClassificacoes == 1 ? " classificação" : " classificações") + ")\n" +
                        String(proj.numeroDownloads);
                }

                // $w("#rating").text = proj.classificacaoTotal == 0 ? "0,0" : Number(proj.classificacaoTotal / proj.numeroClassificacoes).toFixed(1).replace(".", ",");
                // $w("#ratings").text = String(proj.numeroClassificacoes);
                // if (proj.lancamento == 0) {
                //     $w("#downloads").text = String(proj.numeroPreRegistos); // + " pré-registo" + (proj.numeroPreRegistos == 1 ? "" : "s");
                // } else if (proj.lancamento == 1) {
                //     $w("#downloads").text = String(proj.numeroDownloads); // + " " + (proj.preco == 0 ? "download" : "compra") + (proj.numeroDownloads == 1 ? "" : "s");
                // }

                // Avisos

                //let warns = proj.avisosConteudo;
                projWarns = [];
                projWarns.push({ "_id": String(projWarns.length), "name": "age" + proj.faixaEtaria });
                if (proj.lancamento == 1)
                    if (["pptm", "ppsm"].includes(proj.formato)) projWarns.push({ "_id": String(projWarns.length), "name": "macros" });
                if (projWarns.length > 0) {
                    $w("#repWarnings").data = projWarns;
                    $w("#repWarnings").forEachItem(($item, itemData, index) => {
                        if (itemData.name.startsWith("age")) {
                            let ar = itemData.name.substr(3);
                            $item("#imgWarn").src = ar == "undefined" ? getAgeRatingIcon(undefined) : getAgeRatingIcon(ar);
                        } else if (itemData.name == "macros") {
                            $item("#imgWarn").src = "https://static.wixstatic.com/shapes/89e32c_72505eae9672442fbc46abaf4688db2b.svg";
                        }
                    });
                    $w("#repWarnings").show();
                }

                // Classificacoes
                if (conta._id != proj.idAutor && proj.lancamento == 1) {
                    if (proj.adquirido) {
                        if (proj.userRating) {
                            loadUserRating();
                        } else {
                            $w("#boxPubCmt").expand();
                        }
                    } else {
                        $w("#cmtMsg").text = "Para poder avaliar este projeto precisa de o ter adquirido (baixado ou comprado).";
                        $w("#cmtMsg").expand();
                    }
                }
                projGetRatings(sData, proj._id).then((resRatings) => {
                    if (resRatings.status == 1) {
                        let ratings = resRatings.ratings;
                        if (proj.numeroClassificacoes > 0) {
                            $w("#secBtnClassificacoes").label = "CLASSIFICAÇÕES (" + proj.numeroClassificacoes + ")";
                            $w("#cmtsTitle").text = "Classificações (" + proj.numeroClassificacoes + ")";
                        } else {
                            $w("#cmtsTitle").text = "Sem classificações";
                            $w("#loadingCmts").hide();
                        }
                        if (ratings.length > 0) {
                            $w("#repRatings").data = ratings;
                            $w("#repRatings").forEachItem(($item, itemData) => {
                                if (itemData.autor) {
                                    $item("#cmtAuthorPic").src = itemData.autor.imagemPerfil;
                                    $item("#cmtAuthorBtn").label = itemData.autor.nome;
                                    $item("#cmtAuthorBtn").link = "/perfil/" + itemData.autor.caminhoPerfil;
                                } else {
                                    $item("#cmtAuthorPic").src = "wix:image://v1/89e32c_8225f64268b74a35a9bf004cf7fe85de~mv2.png/profile%20picture%20placeholder.png#originWidth=152&originHeight=153";
                                    $item("#cmtAuthorBtn").label = "Conta removida";
                                }
                                $item("#cmtRating").rating = itemData.classificacao;
                                $item("#cmtText").text = itemData.comentario;
                                $item("#cmtPublished").text = "Há " + ago(itemData.dataPublicado);
                                if (itemData.dataEditado) {
                                    $item("#cmtEdited").text = "Editado há " + ago(itemData.dataEditado);
                                    $item("#cmtEdited").show();
                                }
                            });
                            $w("#repRatings").expand();
                            $w("#loadingCmts").hide();
                        }
                    } else {
                        console.error("Failed to load ratings: " + resRatings.error);
                    }
                });

                // Detalhes
                let ver = "";
                let size;
                if (proj.lancamento == 1) {
                    ver = { "producao": "", "beta": "Beta", "alpha": "Alpha" } [proj.mainChannel] + " " + proj["canal" + proj.mainChannel].nomeVersao;
                    size = formatSize(proj["canal" + proj.mainChannel].tamanho);
                } else {
                    ver = "Em breve";
                    size = "Em breve";
                }
                $w("#detailsInfo1").text =
                    proj.idCurto + "\n" +
                    formatDate(proj.dataPublicacao) + "\n" +
                    (proj.dataAtualizacao == undefined ? "–" : formatDate(proj.dataAtualizacao)) + "\n" +
                    ver + "\n" +
                    (proj.formato ? proj.formato : "Em breve") + "\n" +
                    size + "\n" +
                    (proj.versaoPPT ? proj.versaoPPT : "Em breve");
                $w("#detailsCategories").text = "Tipo: " + (proj.tipo ? projectTypes[proj.tipo] : "Em breve") + "\nCategorias: " + (proj.categorias.length > 0 ? getCategoriasList(proj.categorias) : "Em breve");
                $w("#detailsLangs").text = (proj.idiomas.length > 0 ? getIdiomasList(proj.idiomas) : "Em breve");

                // Versões de teste
                loadTestVersions();

                $w("#loadingProj").hide();
                $w("#mainBox1, #mainBox2, #mainBox3, #mainBox4").show();
            }).catch((e) => {
                console.error(e);
                //wixLocation.to("/nao-encontrado?r=err");
            });
        });
    });
});

function loadUserRating() {
    $w("#boxCmt").expand();
    $w("#ratingsDisplay1").rating = proj.userRating.classificacao;
    $w("#userCmtText").text = proj.userRating.comentario;
}

function loadTestVersions() {
    $w("#betasInfo").show();
    $w("#betasInfo2").hide();
    if (proj.lancamento == 1) {
        let testChannels = ["beta", "alpha"];
        // let testChannels = proj.canalproducao ? ["beta", "alpha"] : ["alpha"];
        // if (testChannels.includes("beta") && !proj.canalbeta) testChannels = testChannels.filter(e => e != "beta");
        // if (testChannels.includes("alpha") && !proj.canalalpha) testChannels = testChannels.filter(e => e != "alpha");
        let data = [];
        for (let i = 0; i < testChannels.length; i++) {
            if (proj["canal" + testChannels[i]]) {
                data.push(proj["canal" + testChannels[i]]);
                data[data.length - 1]._id = testChannels[i];
            }
        }
        if (data.length > 0) {
            $w("#repBetas").data = data;
            let canDownload = false;
            $w("#repBetas").forEachItem(($item, itemData, index) => {
                canDownload = false;
                $item("#chanTitulo").text = { "beta": "Beta", "alpha": "Alpha" } [itemData.tipo];
                $item("#chanInfo1").text = "Acesso: " + { "aberto": "Aberto", "fechado": "Fechado" } [itemData.acesso];
                $item("#chanInfo2").text = "";
                if (itemData.acesso == "aberto") {
                    canDownload = true;
                    //if (proj.temAcesso) $item("#chanBtn").link = itemData.download;
                } else if (itemData.acesso == "fechado") {
                    if (itemData.entrou == 0) {
                        $item("#chanBtn").label = "ENTRAR";
                        if (proj.temAcesso) {
                            $item("#chanBtn").enable();
                        } else if (proj.preco > 0) {
                            $w("#betasInfo").hide();
                            $w("#betasInfo2").show();
                        }
                    } else if (itemData.entrou == 1) {
                        $item("#chanBtn").hide();
                        $item("#chanAwaiting").show();
                    } else if (itemData.entrou == 2) {
                        canDownload = true;
                        // $item("#chanBtn").label = "DOWNLOAD";
                        // $item("#chanBtn").link = itemData.download;
                        $item("#chanJoined").show();
                    }
                }
                if (canDownload == true) {
                    $item("#chanBtn").label = "DOWNLOAD";
                    $item("#chanBtn").link = itemData.download;
                    $item("#chanBtn").enable();
                    $item("#chanInfo2").text = "Versão: " + itemData.nomeVersao + " | Tamanho: " + formatSize(itemData.tamanho);
                    if (itemData.novidades) {
                        $item("#chanNovidades").text = itemData.novidades;
                        $item("#chanBtnNovidades").expand();
                    }
                }
            });
            $w("#secBtnBetas").show();
        }
    }
}

function getVersionPhase(phase) {
    switch (phase) {
    case "prealpha":
        return "Pré-Alfa";
    case "alpha":
        return "Alfa";
    case "beta":
        return "Beta";
    case "final":
        return "";
    }
}

const projectTypes = {
    "jogo": "Jogo",
    "sistema": "Sistema",
    "utilitario": "Utilitário"
}

export function btnImg_click(event) {
    $w("#repImgs").forEachItem(($item, itemData, index) => {
        if (itemData._id === event.context.itemId) {
            $item("#selImg").show();
            $item("#btnImg").disable();
            if (itemData.type === "image") {
                $w("#curImg").src = itemData.src;
                $w("#curImg").show();
                $w("#videoPlayer1").hide();
            } else if (itemData.type === "video") {
                $w("#videoPlayer1").src = itemData.src;
                $w("#videoPlayer1").show();
                $w("#curImg").hide();
            }
        } else {
            $item("#selImg").hide();
            $item("#btnImg").enable();
        }
    });
}

export function secBtn_click(event) {
    const sec = event.target.id.substr(6).toLowerCase();
    $w("#statebox1").changeState(sec);
    $w("#secBtnSobre, #secBtnClassificacoes, #secBtnDetalhes, #secBtnBetas").enable();
    event.target.disable();
}

export function btnOptions_click(event) {
    if ($w("#boxOptions").hidden) {
        $w("#boxOptions").show();
    } else {
        $w("#boxOptions").hide();
    }
}

/**
 *	Adds an event handler that runs when the element is clicked.
 *	 @param {$w.MouseEvent} event
 */
export function btnGet_click(event) {
    $w("#btnGet").disable();
    $w("#loadingGet").show();
    if ($w("#btnGet").label == "DOWNLOAD") {
        downloadProject(sData, proj._id).then(() => {
            $w("#loadingGet").hide();
            $w("#btnGet").enable();
            $w("#cmtMsg").collapse();
            $w("#boxPubCmt").expand();
        });
    } else if ($w("#btnGet").label == "COMPRAR") {
        wixWindow.openLightbox("Comprar", { type: "project", proj: proj._id, sData }).then((res) => {
            if (res) {
                $w("#btnGet").label = "DOWNLOAD";
                $w("#btnGet").link = res;
                $w("#infoGet").text = "Comprou este projeto.";
                $w("#infoGet").expand();
                $w("#cmtMsg").collapse();
                $w("#boxPubCmt").expand();
            }
            $w("#loadingGet").hide();
            $w("#btnGet").enable();
        });
    } else if ($w("#btnGet").label == "PRÉ-REGISTO") {
        preRegisterProject(sData, proj._id, true).then(() => {
            $w("#btnGet").label = "REMOVER PRÉ-REGISTO";
            $w("#loadingGet").hide();
            $w("#btnGet").enable();
            wixWindow.openLightbox("Mensagem", { title: "Pré-registo concluído", desc: "Receberá uma notificação assim que o projeto lançar." });
        }).catch((e) => {
            console.log(e);
        });
    } else if ($w("#btnGet").label == "REMOVER PRÉ-REGISTO") {
        preRegisterProject(sData, proj._id, false).then(() => {
            $w("#btnGet").label = "PRÉ-REGISTO";
            $w("#loadingGet").hide();
            $w("#btnGet").enable();
        }).catch((e) => {
            console.log(e);
        });
    }
}

/**
 *	Adds an event handler that runs when the element is clicked.
 *	 @param {$w.MouseEvent} event
 */
export function chanBtnNovidades_click(event) {
    $w("#repBetas").forItems([event.context.itemId], ($item) => {
        if ($item("#chanBoxNovidades").collapsed) {
            $item("#chanBoxNovidades").expand();
            $item("#chanBtnNovidades").label = "Ocultar novidades";
        } else {
            $item("#chanBoxNovidades").collapse();
            $item("#chanBtnNovidades").label = "Mostrar novidades";
        }
    });
}

/**
 *	Adds an event handler that runs when the element is clicked.
 *	 @param {$w.MouseEvent} event
 */
export function chanBtn_click(event) {
    event.target.disable();
    if (event.target.label == "DOWNLOAD") {
        downloadProject(sData, proj._id).then(() => {
            event.target.enable();
        });
    } else if (event.target.label == "ENTRAR") {
        joinProjChan(sData, proj._id, event.context.itemId).then(() => {
            wixWindow.openLightbox("Mensagem", {
                title: "Pedido para entrar enviado",
                desc: "O autor do projeto foi notificado e decidirá se aceita ou recusa a sua entrada para o canal " + { "beta": "Beta", "alpha": "Alpha" } [event.context.itemId] +
                    ". Receberá uma notificação assim que o autor tomar uma decisão."
            });
            loadTestVersions();
        }).catch((e) => {
            console.error(e);
        });
    }
}

function getClass(classCont) {
    const cla = ["violencia-ligeira", "violencia-extrema", "assustador", "linguagem-obscena", "atividades-restricao"];
    let cl = [];
    for (let i = 0; i < 5; i++) {
        if (classCont[cla[i]] == true) {
            cl.push(cla[i]);
        }
    }
    return cl;
}

/**
 *	Adds an event handler that runs when the element is clicked.
 *	 @param {$w.MouseEvent} event
 */
export function btnWarn_click(event) {
    const index = Number(event.context.itemId);
    if (projWarns[index].name.startsWith("age")) {
        if (projWarns[index].name == "ageundefined") {
            wixWindow.openLightbox("Mensagem", {
                title: "Faixa etária por determinar",
                desc: "Este projeto ainda não tem uma faixa etária definida."
            });
        } else if (projWarns[index].name == "age0") {
            wixWindow.openLightbox("Mensagem", {
                title: "Destinado para públicos de qualquer idade",
                desc: "Este projeto não contém restrição de idade."
            });
        } else {
            wixWindow.openLightbox("Mensagem", {
                title: "Apenas destinado a públicos com idade igual ou superior a " + proj.faixaEtaria + " anos.",
                desc: getContentClassDesc(getClass(proj.classificacaoConteudo))
            });
        }
    } else if (projWarns[index].name == "macros") {
        wixWindow.openLightbox("Mensagem", {
            title: "Contém macros (VBA)",
            desc: "Este projeto contém macros (código VBA)."
        });
    }
}

/**
 *	Adds an event handler that runs when the element is clicked.
 *	 @param {$w.MouseEvent} event
 */
export function btnListaDesejosAdd_click(event) {
    $w("#btnListaDesejosAdd").disable();
    $w("#loadingListaDesejos").show();
    projWishlist(sData, proj._id, true).then(() => {
        wixWindow.openLightbox("Mensagem", {
            title: "Projeto adicionado à sua Lista de Desejos",
            desc: "Receberá uma notificação sempre que o projeto estiver em desconto."
        });
        $w("#loadingListaDesejos").hide();
        $w("#btnListaDesejosAdd").hide();
        $w("#btnListaDesejosRem").show();
        $w("#btnListaDesejosAdd").enable();
        $w("#boxOptions").hide();
    });
}

/**
 *	Adds an event handler that runs when the element is clicked.
 *	 @param {$w.MouseEvent} event
 */
export function btnListaDesejosRem_click(event) {
    $w("#btnListaDesejosRem").disable();
    $w("#loadingListaDesejos").show();
    projWishlist(sData, proj._id, false).then(() => {
        wixWindow.openLightbox("Mensagem", {
            title: "Projeto removido da sua Lista de Desejos"
        });
        $w("#loadingListaDesejos").hide();
        $w("#btnListaDesejosRem").hide();
        $w("#btnListaDesejosAdd").show();
        $w("#btnListaDesejosRem").enable();
        $w("#boxOptions").hide();
    });
}

/**
 *	Adds an event handler that runs when the element is clicked.
 *	 @param {$w.MouseEvent} event
 */
export function btnDenunciar_click(event) {
    wixWindow.openLightbox("Denunciar", { type: "project", proj: proj._id, acc: conta._id, at: conta.at }).then((res) => {
        $w("#boxOptions").hide();
    });
}

/**
*	Adds an event handler that runs when an input element's value
 is changed.
*	 @param {$w.Event} event
*/
export function ratingsInput1_change(event) {
    if ($w("#ratingsInput1").value != undefined) $w("#textBoxComment, #btnCmtPublish, #btnCmtCancel").expand();
}

/**
 *	Adds an event handler that runs when the element is clicked.
 *	 @param {$w.MouseEvent} event
 */
export function btnCmtCancel_click(event) {
    if (proj.userRating) {
        $w("#boxCmt").expand();
        $w("#boxPubCmt").collapse();
    } else {
        $w("#ratingsInput1").value = undefined;
        $w("#textBoxComment, #btnCmtPublish, #btnCmtCancel").collapse();
    }
}

/**
 *	Adds an event handler that runs when the element is clicked.
 *	 @param {$w.MouseEvent} event
 */
export function btnCmtPublish_click(event) {
    if ($w("#ratingsInput1").value == undefined) return;
    $w("#ratingsInput1, #textBoxComment, #btnCmtPublish, #btnCmtCancel").disable();
    $w("#loadingPubCmt").show();
    projPublishRating(sData, proj._id, { classificacao: $w("#ratingsInput1").value, comentario: $w("#textBoxComment").value }).then((res) => {
        if (res.status == 1) {
            proj.userRating = res.data;
            $w("#boxPubCmt").collapse();
            $w("#ratingsInput1, #textBoxComment, #btnCmtPublish, #btnCmtCancel").enable();
            loadUserRating();
            $w("#loadingPubCmt").hide();
            if (res.data.isNew && res.data.xp) {
                wixWindow.openLightbox("Mensagem", {
                    title: "Classificação publicada com sucesso!",
                    desc: "Como recompensa recebeu " + res.data.xp + " XP."
                });
            }
        } else {
            console.error("Failed to publish rating: " + res.error);
        }
    });
}

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function btnNominateProjAwards_click(event) {
    // This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
    // Add your code for this event here: 
}

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function btnUserCmtEdit_click(event) {
    $w("#ratingsInput1").value = proj.userRating.classificacao;
    $w("#textBoxComment").value = proj.userRating.comentario;
    $w("#btnCmtPublish").label = "SALVAR";
    $w("#textBoxComment, #btnCmtPublish, #btnCmtCancel").expand();
    $w("#boxCmt").collapse();
    $w("#boxPubCmt").expand();
}

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function btnUserCmtRem_click(event) {
    wixWindow.openLightbox("Mensagem", {
        "title": "Remover classificação",
        "yesno": true,
        "desc": "Remover permanentemente a sua classificação?"
    }).then((res) => {
        if (res == "yes") {
            projRemoveRating(sData, proj._id).then(() => {
                proj.userRating = undefined;
                $w("#ratingsInput1").value = undefined;
                $w("#textBoxComment").value = "";
                $w("#btnCmtPublish").label = "PUBLICAR";
                $w("#textBoxComment, #btnCmtPublish, #btnCmtCancel").collapse();
                $w("#boxCmt").collapse();
                $w("#boxPubCmt").expand();
            });
        }
    });
}

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function btnModerate_click(event) {
    wixWindow.openLightbox("Moderar", { acc: conta._id, at: conta.at, proj: proj._id });
    $w("#boxOptions").hide();
}

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function btnPrevImg_click(event) {
    if (mediaCurPage > 0) {
        mediaCurPage--;
        refreshMediaPages();
    }
}

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function btnNextImg_click(event) {
    if (mediaCurPage < mediaPageCount - 1) {
        mediaCurPage++;
        refreshMediaPages();
    }
}

function refreshMediaPages() {
    if (mediaCurPage > 0)
        $w("#btnPrevImg").enable();
    else
        $w("#btnPrevImg").disable();

    if (mediaCurPage < mediaPageCount - 1)
        $w("#btnNextImg").enable();
    else
        $w("#btnNextImg").disable();

    $w("#repImgs").data = media.slice(mediaCurPage * 5, mediaCurPage * 5 + 5);
    $w("#repImgs").forEachItem(($item, itemData, index) => {
        if (index === 0) {
            $item("#selImg").show();
            $item("#btnImg").disable();
        }
        if (itemData.type === "image") {
            $item("#img").src = itemData.src;
        } else if (itemData.type === "video") {
            $item("#img").src = "http://i3.ytimg.com/vi/" + itemData.src.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)[2] + "/hqdefault.jpg"; // maxresdefault
        }
    });

    const m = media[mediaCurPage * 5];
    if (m["type"] === "image") {
        $w("#curImg").src = m["src"];
        $w("#curImg").show();
    } else if (m["type"] === "video") {
        $w("#videoPlayer1").src = m.src;
        $w("#videoPlayer1").show();
    }
}