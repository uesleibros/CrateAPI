import wixFetch from 'wix-fetch';

export function formatCredits(value, isRaw = false) {
    if (isRaw) value /= 100;
    return Number(value).toFixed(2).replace(".", ",") + " C";
}

// formats: comp (dd/mm/yyyy), short (d mon yyyy), long (d month yyyy)
export function formatDate(date = new Date(), format = "comp") {
    date = new Date(date);
    let d = String(date.getDate());
    let m = String(date.getMonth() + 1);
    let y = String(date.getFullYear());
    if (format == "comp") {
        if (d.length == 1) d = "0" + d;
        if (m.length == 1) m = "0" + m;
        return d + "/" + m + "/" + y;
    } else if (format == "short") {
        const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
        return d + " " + months[date.getMonth()] + " " + y;
    } else if (format == "long") {
        const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
        return d + " de " + months[date.getMonth()] + " de " + y;
    }
}

export function formatTime(time = new Date()) {
    let h = String(time.getHours());
    let m = String(time.getMinutes());
    let s = String(time.getSeconds());
    if (h.length === 1) { h = "0" + h; }
    if (m.length === 1) { m = "0" + m; }
    if (s.length === 1) { s = "0" + s; }
    return h + ":" + m + ":" + s;
}

export function formatSize(size) {
    let unit;
    if (size < 1000000) {
        unit = "KB";
        size = size / 1000;
    } else if (size < 1000000000) {
        unit = "MB";
        size = size / 1000000;
    } else if (size >= 1000000000) {
        unit = "GB";
        size = size / 1000000000;
    }
    return Number(size).toFixed(2).replace(".", ",") + " " + unit;
}

export function formatXP(value) {
    return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
}

export function isValidURL(value) {
    return !!/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(value);
}

export function getLevel(xp) {
    return Math.floor(Math.sqrt((xp + 100) / 100));
}

export function getXp(level) {
    return level * level * 100 - 100;
}

export function hasDoneCheckIn(lastCheckIn) {
    const d = new Date();
    return lastCheckIn.getDate() == d.getDate() &&
        lastCheckIn.getMonth() == d.getMonth() &&
        lastCheckIn.getFullYear() == d.getFullYear();
}

export function hasCheckInStreak(lastCheckIn) {
    const nextCheckIn = new Date(lastCheckIn);
    nextCheckIn.setDate(nextCheckIn.getDate() + 1)
    return hasDoneCheckIn(nextCheckIn);
}

export function getCheckInReward(prog) {
    if (prog == 0)
        return 0;
    else if (prog == 30)
        return 400;
    else
        return Math.round(1.4 * prog + 1.5);
}

export function genShortId() {
    let si = "";
    let map = "Bb0CcDd1FfGg2HhJj3KkLl4MmNn5PpQq6RrSs7TtVv8WwXx9YyZz";
    for (var i = 1; i < 6; i++) { si += map[Math.floor(Math.random() * 52)]; }
    return si;
}

export function getAgeRatingIcon(ageRating) {
    if (ageRating != undefined) {
        return {
            "unknown": "https://static.wixstatic.com/media/89e32c_81212009fbe248b884d6b9a2df819dbb~mv2.png",
            "0": "https://static.wixstatic.com/media/89e32c_5a765fd9be1e439993127f623623de1b~mv2.png",
            "7": "https://static.wixstatic.com/media/89e32c_feefcdbe84294802bcc6c80d258850c7~mv2.png",
            "12": "https://static.wixstatic.com/media/89e32c_e658767ed271454fb72fdef7ae66e06b~mv2.png",
            "16": "https://static.wixstatic.com/media/89e32c_7ba9106991c045ae8038a6f40a6dc501~mv2.png",
            "18": "https://static.wixstatic.com/media/89e32c_31f4b44393254754adc0d3aa0fec9bdb~mv2.png"
        } [String(ageRating)];
    } else {
        return "https://static.wixstatic.com/media/89e32c_81212009fbe248b884d6b9a2df819dbb~mv2.png";
    }
}

export function checkAgeRatingReq(ageRating, dob) {
    const base = new Date();
    base.setFullYear(base.getFullYear() - ageRating);
    return dob.getTime() <= base.getTime();
}

export function getContentClassDesc(cls) {
    const cla = {
        "violencia-ligeira": "violência ligeira",
        "violencia-extrema": "conteúdo extremamente violento",
        "assustador": "imagens ou sons que podem parecer assustadores ou apavorantes",
        "linguagem-obscena": "linguagem obscena, inapropriada ou ofensiva",
        "atividades-restricao": "foca na promoção de itens ou atividades que tipicamente têm restrição de idade, como cigarros, álcool, armas de fogo ou jogos de azar"
    };
    cls.forEach((e, index) => cls[index] = cla[e]);
    return "O projeto contém " + cls.join(", ") + ".";
}

export function getCategoriasList(categories) {
    const catgs = {
        "arcada": "Arcada",
        "aventura": "Aventura",
        "acao": "Ação",
        "casual": "Casual",
        "classico": "Clássico",
        "conducao": "Condução",
        "desporto": "Desporto/Esporte",
        "educativo": "Educativo",
        "entretenimento": "Entretenimento",
        "estrategia": "Estratégia",
        "labirinto": "Labirinto",
        "luta": "Luta",
        "plataforma": "Plataforma",
        "puzzle": "Puzzle",
        "quiz": "Quiz",
        "role-playing-game": "Role Playing Game (RPG)",
        "sandbox": "Sandbox",
        "simulacao": "Simulação",
        "terror": "Terror",
        "tiro": "Tiro",
        "sistema-operativo": "Sistema Operativo/Operacional",
        "smartphone": "Smartphone",
        "consola": "Consola/Console",
        "edicao": "Edição",
        "desenho": "Desenho",
        "navegador": "Navegador",
        "inteligencia-artificial": "Inteligência artificial",
        "outro": "Outro"
    }
    for (let i = 0; i < categories.length; i++) {
        categories[i] = catgs[categories[i]];
    }
    return categories.join(", ");
}

export function getIdiomasList(langs) {
    for (let i = 0; i < langs.length; i++) {
        langs[i] = idiomas[langs[i]];
    }
    return langs.join(", ");
}

export const idiomas = {
    "de": "Alemão",
    "zh": "Chinês",
    "es": "Espanhol",
    "es-es": "Espanhol (Espanha)",
    "es-mx": "Espanhol (México)",
    "fr": "Francês",
    "en": "Inglês",
    "en-ca": "Inglês (Canadá)",
    "en-us": "Inglês (Estados Unidos)",
    "en-gb": "Inglês (Reino Unido)",
    "ja": "Japonês",
    "pt": "Português",
    "pt-br": "Português (Brasil)",
    "pt-pt": "Português (Portugal)",
    "ru": "Russo",
    "be": "Bielorrusso",
    "outros": "Outro(s)"
};

export const categorias = {
    "jogo": {
        "arcada": "Arcada",
        "aventura": "Aventura",
        "acao": "Ação",
        "casual": "Casual",
        "classico": "Clássico",
        "conducao": "Condução",
        "desporto": "Desporto/Esporte",
        "educativo": "Educativo",
        "entretenimento": "Entretenimento",
        "estrategia": "Estratégia",
        "labirinto": "Labirinto",
        "luta": "Luta",
        "plataforma": "Plataforma",
        "puzzle": "Puzzle",
        "quiz": "Quiz",
        "role-playing-game": "Role Playing Game (RPG)",
        "sandbox": "Sandbox",
        "simulacao": "Simulação",
        "terror": "Terror",
        "tiro": "Tiro",
        "outro": "Outro"
    },
    "sistema": {
        "sistema-operativo": "Sistema Operativo/Operacional",
        "smartphone": "Smartphone",
        "consola": "Consola/Console",
        "outro": "Outro"
    },
    "utilitario": {
        "edicao": "Edição",
        "desenho": "Desenho",
        "navegador": "Navegador",
        "inteligencia-artificial": "Inteligência artificial",
        "outro": "Outro"
    }
};

// export function sendNotification(id, notification, image, link) {
//     return new Promise(function (resolve, reject) {
//         wixData.insert("Notificacoes", {
//             "idConta": id,
//             "naolido": "[]",
//             "notificacao": notification,
//             "imagem": image,
//             "link": link
//         }).then(() => {
//             resolve("done");
//         });
//     });
// }

export function getProjScore(pos, neg) {
    const total = pos + neg;

    if (total == 0)
        return 0;

    const p = pos / total;
    const b = 10;

    if (total > b)
        return p;

    const cMax = 0.75;
    const c = p * (cMax / 0.5 - 1) - cMax + 1;
    const a = (p - c) / (Math.log1p(b));
    return c + a * Math.log1p(total);
}

export function ago(date) {
    date = Date.now() - date;
    if (date < 60 * 1000) {
        return Math.round(date / 1000) + " segundos";
    } else if (date < 89 * 1000) {
        return "1 minuto";
    } else if (date < 44 * 60 * 1000) {
        return Math.round(date / 60 / 1000) + " minutos";
    } else if (date < 89 * 60 * 1000) {
        return "1 hora";
    } else if (date < 21 * 60 * 60 * 1000) {
        return Math.round(date / 60 / 60 / 1000) + " horas";
    } else if (date < 35 * 60 * 60 * 1000) {
        return "1 dia";
    } else if (date < 6 * 24 * 60 * 60 * 1000) {
        return Math.round(date / 24 / 60 / 60 / 1000) + " dias";
    } else if (date < 11 * 24 * 60 * 60 * 1000) {
        return "1 semana";
    } else if (date < 29 * 24 * 60 * 60 * 1000) {
        return Math.round(date / 7 / 24 / 60 / 60 / 1000) + " semanas";
    } else if (date < 45 * 24 * 60 * 60 * 1000) {
        return "1 mês";
    } else if (date < 319 * 24 * 60 * 60 * 1000) {
        return Math.round(date / 29 / 24 / 60 / 60 / 1000) + " meses";
    } else if (date < 547 * 24 * 60 * 60 * 1000) {
        return "1 ano";
    }
    return Math.round(date / 365 / 24 / 60 / 60 / 1000) + " anos";
}

export function getTimeLeft(d) {
    if (Math.round(d / 1000) == 0) {
        return "0 segundos";
    } else if (Math.round(d / 1000) <= 1) {
        return Math.round(d / 1000) + " segundo";
    } else if (Math.round(d / 1000) < 60) {
        return Math.round(d / 1000) + " segundos";
    } else if (Math.round(d / 1000 / 60) <= 1) {
        return Math.round(d / 1000 / 60) + " minuto";
    } else if (Math.round(d / 1000 / 60) < 60) {
        return Math.round(d / 1000 / 60) + " minutos";
    } else if (Math.round(d / 1000 / 60 / 60) == 1) {
        return Math.round(d / 1000 / 60 / 60) + " hora";
    } else {
        return Math.ceil(d / 1000 / 60 / 60) + " horas";
    }
}

export function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return String(parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]).replace(".", ",");
}

export function getFullImageURL(imageSrc) {
    if (imageSrc.startsWith("wix:")) imageSrc = imageSrc.substr(4);
    if (imageSrc.startsWith("image:")) {
        let wixImageURL = "https://static.wixstatic.com/media/";
        let wixLocalURL = imageSrc.replace('image://v1/', '');
        wixLocalURL = wixLocalURL.substr(0, wixLocalURL.indexOf('/'));
        return wixImageURL + wixLocalURL;
    } else {
        return imageSrc;
    }
}

export function postSvc(svc, data) {
    return fetch("https://pptgamespt.wixsite.com/crate/_functions/svc/" + svc, {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(data)
    }).then((httpResponse) => {
        return httpResponse.json().then((json) => {
            if (httpResponse.ok) {
                return Promise.resolve(json);
            } else {
                return Promise.reject(json);
            }
        });
    }).catch(err => {
        return Promise.reject(err);
    });
}