<template>
    <section>
        <div class="box">
            <article class="media">
                <div class="media-left">
                    <div>
                        <i class="lni lni-timer"></i>
                    </div>
                </div>

                <div class="media-content">
                    <div class="content">
                        <div>
                            <p class="is-size-5 has-text-weight-medium">
                                Exchanges Rates
                            </p>
                            <p class="has-text-weight-medium is-size-6">
                                {{ widgetBase + ' to ' + widgetSymbol }}
                            </p>
                        </div>
                        <div>
                            <div class="columns is-gapless mt-5 is-flex">
                                <div class="column mt-1">
                                    <img
                                        src="https://www.flaticon.com/svg/static/icons/svg/922/922222.svg"
                                        style="width: 72px; height: 72px"
                                    />
                                </div>
                                <div class="mt-3 ml-6">
                                    <p>{{ '1 ' + widgetBase + ' is worth' }}</p>
                                    <p class="has-text-weight-bold is-size-4">
                                        {{ rate + ' ' + widgetSymbol }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="media-right">
                    <b-dropdown aria-role="list">
                        <b-button
                            class="ml-3"
                            slot="trigger"
                            size="is-small"
                            type="is-text"
                            icon-left="lni-cog"
                        ></b-button>
                        <b-dropdown-item
                            aria-role="listitem"
                            @click="edit.isActive = true"
                        >
                            <i class="lni lni-pencil"></i> Edit</b-dropdown-item
                        >
                        <b-dropdown-item
                            aria-role="listitem"
                            @click="deleteWidget"
                            ><i class="lni lni-trash"></i>
                            Delete</b-dropdown-item
                        >
                    </b-dropdown>
                </div>
            </article>
            <div :class="['modal', edit.isActive ? 'is-active' : '']">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Modify this widget</p>
                        <button
                            class="delete"
                            aria-label="close"
                            @click="edit.isActive = false"
                        ></button>
                    </header>
                    <section class="modal-card-body">
                        <p class="mb-6">
                            <strong>Description : </strong> This widget allows
                            you know exchange rates between two monies.
                        </p>
                        <div
                            class="is-flex is-align-items-baseline is-justify-content-space-evenly"
                        >
                            <b-field label="Base currency :">
                                <b-select
                                    placeholder="Select a name"
                                    v-model="edit.base"
                                >
                                    <option
                                        v-for="symbol in exchangeSymbols"
                                        :value="symbol"
                                        :key="symbol"
                                    >
                                        {{ symbol }}
                                    </option>
                                </b-select>
                            </b-field>
                            <p
                                class="is-align-self-center has-text-weight-bold is-size-4"
                            >
                                TO
                            </p>
                            <b-field label="Exchange to :">
                                <b-select
                                    placeholder="Select a name"
                                    v-model="edit.symbol"
                                >
                                    <option
                                        v-for="symbol in exchangeSymbols"
                                        :value="symbol"
                                        :key="symbol"
                                    >
                                        {{ symbol }}
                                    </option>
                                </b-select>
                            </b-field>
                        </div>
                        <div class="mt-3">
                            <b-field
                                label="Widger refresh time (in seconds) : "
                            >
                                <b-slider
                                    :max="120"
                                    :min="1"
                                    v-model="edit.timer"
                                ></b-slider>
                            </b-field>
                        </div>

                        <b-notification
                            v-if="edit.missing"
                            type="is-danger"
                            role="alert"
                            :closable="false"
                        >
                            Please fill all the params
                        </b-notification>
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button is-success" @click="modifyWidget">
                            Apply
                        </button>
                        <button class="button" @click="edit.isActive = false">
                            Cancel
                        </button>
                    </footer>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios';
import FinanceApi from '../../services/Finance';

export default {
    name: 'edit',

    props: {
        widgetID: String,
        widgetSymbol: String,
        widgetBase: String,
        widgetTimer: Number,
        fetchWidget: Function,
        exchangeSymbols: Array,
    },

    data() {
        return {
            rate: '',
            timer: 0,
            edit: {
                isActive: false,
                missing: false,
                base: this.widgetBase,
                symbol: this.widgetSymbol,
                timer: this.widgetTimer,
            },
        };
    },

    methods: {
        fetchExchangeRates() {
            this.rate = '';
            axios
                .get(
                    `https://api.exchangeratesapi.io/latest?symbols=${this.widgetSymbol}&base=${this.widgetBase}`
                )
                .then((response) => {
                    this.rate = response.data.rates[this.widgetSymbol];
                });
        },

        deleteWidget() {
            FinanceApi.deleteWidget(this.widgetID).then(() => {
                this.fetchWidget();
            });
        },

        modifyWidget() {
            if (this.edit.symbol.length == 0 || this.edit.base.length == 0) {
                this.edit.missing = true;
                return;
            }

            const widget = {
                id: this.widgetID,
                widgetName: 'exchange-rates',
                symbol: this.edit.symbol,
                base: this.edit.base,
                timer: this.edit.timer,
            };

            FinanceApi.modifyWidget(widget).then(() => {
                this.cancelAutoUpdate();
                this.fetchWidget();
            });
        },

        cancelAutoUpdate() {
            clearInterval(this.timer);
            this.timer = 0;
        },
    },

    created() {
        this.fetchExchangeRates();
        this.timer = setInterval(
            this.fetchExchangeRates,
            this.widgetTimer * 1000
        );
    },

    beforeDestroy() {
        clearInterval(this.timer);
    },
};
</script>

<style>
</style>