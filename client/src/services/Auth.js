import API from '@/services/API';

export default {
    register(user) {
        return API().post('/register/local', user);
    },

    login(user) {
        return API().post('/login/local', user);
    },

    logout() {
        return API().get('/logout/local');
    },

    getActualUser() {
        return API().get('/auth/user');
    },

    async isAuthentified() {
        const response = await API().get('/auth/user');
        if (response.data.id) return true;
        return false;
    }
};
