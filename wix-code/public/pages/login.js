import wixLocation from 'wix-location';
import { local, session } from 'wix-storage';
import wixWindow from 'wix-window';
// import { verifiedLogin } from "backend/acc-auth.jsw";
import { postSvc } from "public/tools.js";

let tentativas = 0;

$w.onReady(function () {
    if (wixWindow.rendering.env != "browser") return;
    // if (wixLocation.query.chg) {
    //     $w("#boxVerified").show();
    //     verifiedLogin({ accountId: wixLocation.query.acc, chg: wixLocation.query.chg }).then((res) => {
    //         if (res.status == 1) {
    //             local.setItem("logged_id", res.accountId);
    //             local.setItem("acc_token", res.accessToken);
    //             $w("#statebox2").changeState("done");
    //             // if (session.getItem("reqlogpag") !== null) {
    //             //     let reqlogpag = session.getItem("reqlogpag");
    //             //     session.removeItem("reqlogpag");
    //             //     wixLocation.to(reqlogpag);
    //             // } else {
    //             //     wixLocation.to("/inicio");
    //             // }
    //         } else if (res.status == 0) {
    //             $w("#statebox2").changeState("error");
    //             switch (res.error) {
    //             case "invalid_link":
    //                 $w("#vlError").text = "Link inválido.";
    //                 break;
    //             case "link_already_used":
    //                 $w("#vlError").text = "Link já usado.";
    //                 break;
    //             case "link_expired":
    //                 $w("#vlError").text = "Link expirado.";
    //             }
    //         }
    //     });
    // } else {
    if (local.getItem("session_id") !== null && local.getItem("access_token") !== null) {
        wixLocation.to("https://pptgamespt.wixsite.com/crate");
    } else {
        $w("#boxLogin").show();
    }
    // }
});

let accountId;

export function doLogin() {
    $w("#error1").collapse();
    if ($w("#input1").value.length == 0) {
        $w("#error1").text = "Identificação em falta.";
        $w("#error1").show();
    } else if ($w("#input2").value.length === 0) {
        $w("#error1").text = "Palavra-passe/Senha em falta."
        $w("#error1").show();
    } else {

        $w("#statebox1").changeState("loading");
        $w("#loadingInfo").text = "A verificar credenciais...";
        postSvc("login", { auth: $w("#input1").value, pw: $w("#input2").value }).then((res) => {
            local.setItem("session_id", res.sessionId);
            local.setItem("acc_token", res.accessToken);
            $w("#loadingInfo").text = "Bem-vindo de volta " + res.nome + "\nA redirecionar...";
            if (session.getItem("reqlogpag") !== null) {
                let reqlogpag = session.getItem("reqlogpag");
                session.removeItem("reqlogpag");
                wixLocation.to(reqlogpag);
            } else {
                wixLocation.to("/inicio");
            }
        }).catch((e) => {
            console.error(e);

            const errors = {
                "incorrect_credencials": "E-mail ou senha estão incorretos.",
                "account_suspended": "Esta conta foi suspendida.",
                "account_not_activated": "Esta conta ainda não foi ativada.",
                "different_location": "Nova localização detetada. Por favor verifique o login através do email que lhe foi enviado.",
                "too_many_failed_logins": "Tentativa de login bloqueada. Volte a tentar mais tarde."
            };

            const errDesc = errors[e.error];
            if (errDesc) {
                $w("#error1").text = errDesc;
            } else {
                $w("#error1").text = "Erro desconhecido: " + e.error;
            }

            $w("#error1").show();
            $w("#statebox1").changeState("main");

            // case "requires_new_password":
            //     $w("#statebox1").changeState("reqNewPw");
            //     $w("#error2").html = fromHtmlTemplate("A sua senha não é mais segura e foi removida. <a href='/recuperar?type=password' style='color:#2B63CC;'><u>Clique aqui</u></a> para definir uma nova senha.");
            //     break;
        });
    }
}

/**
*	Adds an event handler that runs when the cursor is inside the
 input element and a key is pressed.
	[Read more](https://www.wix.com/corvid/reference/$w.TextInputMixin.html#onKeyPress)
*	 @param {$w.KeyboardEvent} event
*/
export function input2_keyPress(event) {
    if (event.key == "Enter") doLogin();
}