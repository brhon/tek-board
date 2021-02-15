<template>
    <b-navbar class="has-background-white-ter" shadow spaced>
        <template slot="start">
            <div class="columns">
                <div class="column"></div>
                <div class="column"></div>
                <div class="column"></div>
                <div class="column"></div>
                <div class="column"></div>
                <div class="column"></div>
                <div class="column"></div>
                <div class="column"></div>
                <div class="column"></div>
                <div class="column"></div>
                <div class="column"></div>
                <div class="column"></div>
                <div class="column"></div>
                <b-navbar-item tag="router-link" :to="{ path: '/' }">
                    <p class="is-size-5 has-text-weight-semibold">
                        💧 DASHBOARD
                    </p>
                </b-navbar-item>
            </div>
        </template>
        <template slot="start"> </template>

        <template slot="end">
            <figure class="image is-48x48">
                <img class="is-rounded" :src="avatar" />
            </figure>
            <b-button type="is-danger" @click="logout()" class="ml-3"
                >Logout</b-button
            >
        </template>
    </b-navbar>
</template>

<script>
import Auth from '@/services/Auth';

export default {
    name: 'Navbar',

    data: function () {
        return {
            username: null,
            avatar: null,
        };
    },

    methods: {
        logout: async function () {
            await Auth.logout();
            this.$router.push({ name: 'login' });
        },

        fetchUserData: function () {
            Auth.getActualUser().then((response) => {
                this.username = response.data.username;
                this.avatar = response.data.avatar;
            });
        },
    },
    created() {
        this.fetchUserData();
    },
};
</script>

<style>
</style>