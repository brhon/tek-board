<template>
    <section class="hero has-background-white-ter is-fullheight">
        <div class="hero-body">
            <div class="container">
                <div class="columns is-vcentered">
                    <div class="column mr-6 has-text-centered">
                        <figure class="image is-4by3 mb-6">
                            <img src="@/assets/images/login.png" alt="" />
                        </figure>
                        <h1 class="title">Dashboard</h1>
                    </div>
                    <div class="column is-4 is-offset-1">
                        <form action="" @submit="checkForm">
                            <p
                                class="is-family-sans-serif has-text-grey is-size-3 has-text-centered has-text-weight-semibold mb-5"
                            >
                                Login
                            </p>

                            <div
                                class="notification is-success is-light has-text-centered"
                                v-if="isRegisterOk"
                            >
                                Hello {{ registeredUsername }}, you are
                                registered !
                            </div>

                            <div
                                class="notification is-danger is-light has-text-centered"
                                v-if="errors.length"
                            >
                                <ul>
                                    <li
                                        v-for="(error, index) in errors"
                                        v-bind:key="index"
                                    >
                                        {{ error }}
                                    </li>
                                </ul>
                            </div>

                            <div class="field">
                                <div class="control has-icons-left">
                                    <input
                                        class="input is-info is-rounded"
                                        type="text"
                                        placeholder="Username"
                                        v-model="username"
                                    />
                                    <span class="icon is-small is-left">
                                        <i class="lni lni-user"></i>
                                    </span>
                                </div>
                            </div>
                            <div class="field">
                                <div class="control has-icons-left">
                                    <input
                                        class="input is-info is-rounded"
                                        type="password"
                                        placeholder="Password"
                                        v-model="password"
                                    />
                                    <span class="icon is-small is-left">
                                        <i class="lni lni-key"></i>
                                    </span>
                                    <a
                                        class="is-flex is-flex-direction-row is-justify-content-flex-end pr-3 pt-2 is-size-7"
                                    >
                                        Forgot password ?
                                    </a>
                                </div>
                            </div>
                            <div>
                                <input
                                    class="button is-fullwidth is-info is-rounded mb-6"
                                    type="submit"
                                    value="Login"
                                />
                            </div>
                        </form>
                        <div>
                            <button
                                @click="loginGoogle"
                                class="button is-fullwidth is-dark is-outlined is-rounded mb-3"
                            >
                                <span class="icon">
                                    <i class="lni lni-google"></i>
                                </span>
                                <span>Login with Google</span>
                            </button>
                        </div>
                        <div>
                            <button
                                class="button is-fullwidth is-dark is-outlined is-rounded mb-5"
                            >
                                <span class="icon">
                                    <i class="lni lni-twitter-original"></i>
                                </span>
                                <span>Login with Twitter</span>
                            </button>
                        </div>
                        <router-link
                            style="text-decoration: none; color: inherit"
                            to="/register"
                        >
                            <div class="has-text-centered">
                                Not registered ?
                                <strong
                                    @mouseover="mouseover"
                                    @mouseout="mouseover"
                                    class="ml-2"
                                    :style="[
                                        registerisUnderlined
                                            ? { 'text-decoration': 'underline' }
                                            : { 'text-decoration': 'none' },
                                    ]"
                                    >Register now !</strong
                                >
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Auth from '@/services/Auth';

export default {
    name: 'Login',
    //
    //
    props: {
        isRegisterOk: Boolean,
        registeredUsername: String,
    },
    //
    data: function () {
        return {
            errors: [],
            username: '',
            password: '',
            registerisUnderlined: false,
        };
    },
    //
    methods: {
        mouseover: function () {
            this.registerisUnderlined = !this.registerisUnderlined;
        },
        checkForm: function (e) {
            this.errors = [];

            if (!this.username || !this.password)
                this.errors.push('Merci de remplir tous les champs.');
            else this.login();
            e.preventDefault();
        },

        loginGoogle: function () {
            window.location.href = '/api/login/google';
        },

        login: function () {
            const user = {
                username: this.username,
                password: this.password,
            };

            Auth.login(user).then((response) => {
                if (response.data.message === 'No user exists')
                    this.errors.push('Identifiant ou mot de passe incorrect.');
                else {
                    this.setNewUser();
                }
            });
        },

        setNewUser: async function () {
            const isAuthentified = await Auth.isAuthentified();
            if (isAuthentified == true) this.$router.push('/');
        },
    },
};
</script>
