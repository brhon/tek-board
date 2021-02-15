import API from '@/services/API';

export default {
    getWidgets() {
        return API().get('/services/dofus/get');
    },

    addDofusItemWidget(name, item) {
        return API().post('/services/dofus/add/addDofusItem', {
            name: name,
            item: item
        });
    },

    addDofusItemSearchWidget(name) {
        return API().post('/services/dofus/add/addDofusItemSearch', {
            name: name
        });
    },

    addDofusCraftWidget(name, item) {
        return API().post('/services/dofus/add/addDofusCraft', {
            name: name,
            item: item
        });
    },

    addDofusCraftWidgetSearch(name) {
        return API().post('/services/dofus/add/addDofusCraftSearch', {
            name: name
        });
    },

    deleteDofusWidget(id) {
        return API().post('/services/dofus/del', {
            id: id
        });
    },

    modifyDofusWidget(newParams) {
        return API().post('/services/dofus/modify', {
            newParams: newParams
        });
    }
};
