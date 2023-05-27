let session;
let account;

$w.onReady(function () {
    $widget.fireEvent("Loaded");
    $widget.props.isLoaded = true;
});

$widget.onPropsChanged((oldProps, newProps) => {

});

/**
 * @function
 * @description Function description
 * @param {object} data - Parameter description
 * @returns {void} Return value description
 * See http://wix.to/VaEzgUn for more information on widget API functions
 */
export function loadSession(data) {
    session = data.session;
    account = data.account;
    $widget.fireEvent("Ready", session);
}

/**
 * @function
 * @description Function description
 * @returns {object} Return value description
 * See http://wix.to/VaEzgUn for more information on widget API functions
 */
export function getSession() {
    return session;
}

/**
 * @function
 * @description Function description
 * @returns {object} Return value description
 * See http://wix.to/VaEzgUn for more information on widget API functions
 */
export function getAccount() {
    return account;
}