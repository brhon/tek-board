import API from '@/services/API';

export default {
    getActiveServices() {
        return API().get('/services/active/get');
    },

    setServices(service) {
        return API().post('/services/active/set', service);
    }
};
