export default {
    install (Vue) {
        Vue.prototype.$showAlert= (message, buttonText, callbackFunction) => {
            if (document.getElementById('popup_alert_wrap')) {
                return;
            }

            const alertElement = document.createElement('div');
            alertElement.className = 'popup_alert_wrap';
            alertElement.id = 'popup_alert_wrap';

            if (buttonText === undefined) {
                buttonText = '확인';
            }

            alertElement.innerHTML = `
                <div class="popup_content">
                    <div class="popup_inner">
                        <div class="popup_inner_wrap">
                            <div class="popup_top">
                                <span class="popup_top_txt">` + message + `</span>
                            </div>
                            <div id="alert_popup_btn" class="popup_btn_bottom">` + buttonText + `</div>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(alertElement);

            document.getElementById('alert_popup_btn').onclick = () => {
                document.getElementById('popup_alert_wrap').remove();

                if (callbackFunction !== undefined) {
                    callbackFunction();
                }
            }
        };

        Element.prototype.remove = function() {
            this.parentElement.removeChild(this);
        };
        NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
            for(var i = this.length - 1; i >= 0; i--) {
                if(this[i] && this[i].parentElement) {
                    this[i].parentElement.removeChild(this[i]);
                }
            }
        };
    }
}