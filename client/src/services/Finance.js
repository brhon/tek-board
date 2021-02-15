import API from '@/services/API';

export default {
    getWidgets() {
        return API().get('/services/finance/get');
    },

    addCryptoViewer(widget) {
        return API().post('/services/finance/widget/add/crytoviewer', widget);
    },

    addCountryTime(widget) {
        return API().post('/services/finance/widget/add/countrytime', widget);
    },

    addExchangeRates(widget) {
        return API().post(
            '/services/finance/widget/add/exchangesRates',
            widget
        );
    },

    deleteWidget(id) {
        return API().post('/services/finance/del', { id: id });
    },

    modifyWidget(widget) {
        return API().post('/services/finance/modify', {
            newParams: widget
        });
    }
};
