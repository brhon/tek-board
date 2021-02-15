<template>
    <section class="hero has-background-light is-fullheight">
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
                                Register
                            </p>

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
                                        placeholder="Email"
                                        v-model="email"
                                    />
                                    <span class="icon is-small is-left">
                                        <i class="lni lni-briefcase"></i>
                                    </span>
                                </div>
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
                                </div>
                            </div>
                            <div>
                                <input
                                    class="button is-fullwidth is-info is-rounded mb-3"
                                    type="submit"
                                    value="Register"
                                />
                            </div>
                        </form>
                        <router-link
                            to="/"
                            style="text-decoration: none; color: inherit"
                        >
                            <div class="has-text-centered">
                                Already registered ?
                                <strong
                                    @mouseover="mouseover"
                                    @mouseout="mouseover"
                                    class="ml-2"
                                    :style="[
                                        registerisUnderlined
                                            ? { 'text-decoration': 'underline' }
                                            : { 'text-decoration': 'none' },
                                    ]"
                                    >Log in now !</strong
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
    name: 'Register',
    //
    components: {},
    //
    data: function () {
        return {
            errors: [],
            username: null,
            password: null,
            email: null,
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

            if (!this.username || !this.password || !this.email)
                this.errors.push('Merci de remplir tous les champs.');
            else if (this.username.length < 4)
                this.errors.push(
                    "L'identifiant doit contenir au moins 4 caractères"
                );
            else if (this.password.length < 6)
                this.errors.push(
                    'Le mot de passe doit contenir au moins 6 caractères.'
                );
            else if (!this.validEmail(this.email))
                this.errors.push("L'email n'est pas valide.");
            else {
                this.register();
            }
            e.preventDefault();
        },

        register: function () {
            const user = {
                email: this.email,
                username: this.username,
                password: this.password,
            };

            Auth.register(user).then((response) => {
                if (response.data.status === '409 Username Exists')
                    this.errors.push('Sorry, this username is already used.');
                if (response.data.status === '409 Email Exists')
                    this.errors.push('Sorry, this email is already used.');
                if (response.data.status === '200 Success')
                    this.$router.push({
                        name: 'login',
                        params: {
                            isRegisterOk: true,
                            registeredUsername: this.username,
                        },
                    });
            });
        },

        validEmail: function (email) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
    },
};
</script>

<style>
</style>
