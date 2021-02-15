<template>
    <section class="mt-6">
        <p class="is-size-6 has-text-weight-semibold mb-2">Add new Widgets:</p>
        <div class="column is-flex is-flex-wrap-wrap mb-6">
            <b-button
                class="is-align-self-flex-start"
                type="is-primary is-light"
                icon-left="lni-flag"
                @click="dofusItemData.isActive = true"
                >Dofus Item</b-button
            >
            <b-button
                class="is-align-self-flex-start"
                type="is-primary is-light ml-3"
                icon-left="lni-flag"
                @click="dofusItemSearchData.isActive = true"
                >Dofus Item Search</b-button
            >
            <b-button
                class="is-align-self-flex-start"
                type="is-primary is-light ml-3"
                icon-left="lni-hammer"
                @click="dofusCraftData.isActive = true"
                >Dofus Craft</b-button
            >
            <b-button
                class="is-align-self-flex-start"
                type="is-primary is-light ml-3"
                icon-left="lni-hammer"
                @click="dofusCraftDataSearch.isActive = true"
                >Dofus Craft Search</b-button
            >
        </div>
        <div class="is-flex is-flex-wrap-wrap is-align-content-flex-start">
            <div
                v-for="(widget, index) in widgets"
                v-bind:key="index"
                class="ml-3 mr-3 mt-3"
            >
                <dofus-item-widget
                    :widgetName="widget.name"
                    :widgetId="widget.id"
                    v-if="widget.widgetName == 'dofus-item'"
                    :itemName="widget.item"
                    :fetchWidgets="fetchDofusWidgets"
                ></dofus-item-widget>
                <dofus-craft-widget
                    v-if="widget.widgetName == 'dofus-craft'"
                    :widgetName="widget.name"
                    :widgetId="widget.id"
                    :itemName="widget.item"
                    :fetchWidgets="fetchDofusWidgets"
                >
                </dofus-craft-widget>
                <dofus-item-dynamic
                    v-if="widget.widgetName == 'dofus-item-search'"
                    :widgetName="widget.name"
                    :widgetId="widget.id"
                    :fetchWidgets="fetchDofusWidgets"
                >
                </dofus-item-dynamic>
                <dofus-craft-dynamic
                    v-if="widget.widgetName == 'dofus-craft-search'"
                    :widgetName="widget.name"
                    :widgetId="widget.id"
                    :fetchWidgets="fetchDofusWidgets"
                >
                </dofus-craft-dynamic>
            </div>
        </div>
        <div :class="['modal', dofusItemData.isActive ? 'is-active' : '']">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Widget: Dofus Item</p>
                    <button
                        class="delete"
                        aria-label="close"
                        @click="dofusItemData.isActive = false"
                    ></button>
                </header>
                <section class="modal-card-body">
                    <p class="mb-4">
                        <strong>Description : </strong> This widget will give
                        you information about a Dofus item.
                    </p>
                    <b-field label="Name :">
                        <b-input v-model="dofusItemData.nameModel"></b-input>
                    </b-field>
                    <b-field label="Item Name :">
                        <b-input v-model="dofusItemData.itemModel">></b-input>
                    </b-field>
                    <p>
                        Item name bust correct, please refer to the
                        <a
                            class="has-text-weight-bold"
                            href="https://www.dofus.com/fr/mmorpg/encyclopedie/equipements?size=96&display=mosaic"
                            target="_blank"
                            rel="noopener noreferrer"
                            >official documentation.</a
                        >
                    </p>
                    <b-notification
                        v-if="dofusItemData.missingName"
                        type="is-danger"
                        role="alert"
                        :closable="false"
                    >
                        Please fill all the params.
                    </b-notification>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" @click="addDofusItem">
                        Add this widget
                    </button>
                    <button
                        class="button"
                        @click="dofusItemData.isActive = false"
                    >
                        Cancel
                    </button>
                </footer>
            </div>
        </div>
        <div :class="['modal', dofusCraftData.isActive ? 'is-active' : '']">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Widget: Dofus Craft</p>
                    <button
                        class="delete"
                        aria-label="close"
                        @click="dofusCraftData.isActive = false"
                    ></button>
                </header>
                <section class="modal-card-body">
                    <p class="mb-4">
                        <strong>Description : </strong> This widget allows you
                        to know the recipe to craft an item.
                    </p>
                    <b-field label="Name :">
                        <b-input v-model="dofusCraftData.nameModel"></b-input>
                    </b-field>
                    <b-field label="Which item would you like to craft ?">
                        <b-input v-model="dofusCraftData.itemModel"></b-input>
                    </b-field>
                    <p>
                        Item name bust correct, please refer to the
                        <a
                            class="has-text-weight-bold"
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.dofus.com/fr/mmorpg/encyclopedie/equipements?size=96&display=mosaic"
                            >official documentation.</a
                        >
                    </p>
                    <b-notification
                        v-if="dofusCraftData.missingName"
                        type="is-danger"
                        role="alert"
                        :closable="false"
                    >
                        Please fill all the params
                    </b-notification>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" @click="addDofusCraft">
                        Add this widget
                    </button>
                    <button
                        class="button"
                        @click="dofusCraftData.isActive = false"
                    >
                        Cancel
                    </button>
                </footer>
            </div>
        </div>
        <div
            :class="['modal', dofusItemSearchData.isActive ? 'is-active' : '']"
        >
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Widget: Dofus Item Search</p>
                    <button
                        class="delete"
                        aria-label="close"
                        @click="dofusItemSearchData.isActive = false"
                    ></button>
                </header>
                <section class="modal-card-body">
                    <p class="mb-4">
                        <strong>Description : </strong> This widget will give
                        you information about any Dofus item.
                    </p>
                    <b-field label="Widget name :">
                        <b-input
                            v-model="dofusItemSearchData.nameModel"
                        ></b-input>
                    </b-field>
                    <p>
                        Item name bust correct, please refer to the
                        <a
                            class="has-text-weight-bold"
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.dofus.com/fr/mmorpg/encyclopedie/equipements?size=96&display=mosaic"
                            >official documentation.</a
                        >
                    </p>
                    <b-notification
                        v-if="dofusItemSearchData.missingName"
                        type="is-danger"
                        role="alert"
                        :closable="false"
                    >
                        Please fill all the params.
                    </b-notification>
                </section>
                <footer class="modal-card-foot">
                    <button
                        class="button is-success"
                        @click="addDofusItemSearch"
                    >
                        Add this widget
                    </button>
                    <button
                        class="button"
                        @click="dofusItemSearchData.isActive = false"
                    >
                        Cancel
                    </button>
                </footer>
            </div>
        </div>
        <div
            :class="['modal', dofusCraftDataSearch.isActive ? 'is-active' : '']"
        >
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Widget: Dofus Craft Search</p>
                    <button
                        class="delete"
                        aria-label="close"
                        @click="dofusCraftDataSearch.isActive = false"
                    ></button>
                </header>
                <section class="modal-card-body">
                    <p class="mb-4">
                        <strong>Description : </strong> This widget allows you
                        to know the recipe to craft any item.
                    </p>
                    <b-field label="Widget name :">
                        <b-input
                            v-model="dofusCraftDataSearch.nameModel"
                        ></b-input>
                    </b-field>
                    <p>
                        Item name bust correct, please refer to the
                        <a
                            class="has-text-weight-bold"
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.dofus.com/fr/mmorpg/encyclopedie/equipements?size=96&display=mosaic"
                            >official documentation.</a
                        >
                    </p>
                    <b-notification
                        v-if="dofusCraftDataSearch.missingName"
                        type="is-danger"
                        role="alert"
                        :closable="false"
                    >
                        Please fill all the params.
                    </b-notification>
                </section>
                <footer class="modal-card-foot">
                    <button
                        class="button is-success"
                        @click="addDofusCraftSearch"
                    >
                        Add this widget
                    </button>
                    <button
                        class="button"
                        @click="dofusCraftDataSearch.isActive = false"
                    >
                        Cancel
                    </button>
                </footer>
            </div>
        </div>
    </section>
</template>

<script>
import DofusItemWidget from '../components/DofusWidget/DofusItemWidget.vue';
import DofusCraftWidget from '../components/DofusWidget/DofusCraftWidget.vue';
import DofusCraftDynamic from '../components/DofusWidget/DofusCraftDynamic.vue';
import DofusItemDynamic from '../components/DofusWidget/DofusItemDynamic.vue';
import DofusAPI from '../services/Dofus';

export default {
    name: 'DofusService',

    components: {
        DofusItemWidget,
        DofusCraftWidget,
        DofusCraftDynamic,
        DofusItemDynamic,
    },

    data: function () {
        return {
            widgets: [],
            dofusItemData: {
                isActive: false,
                missingName: false,
                nameModel: '',
                itemModel: '',
            },
            dofusItemSearchData: {
                isActive: false,
                missingName: false,
                nameModel: '',
            },
            dofusCraftData: {
                isActive: false,
                missingName: false,
                nameModel: '',
                itemModel: '',
            },
            dofusCraftDataSearch: {
                isActive: false,
                missingName: false,
                nameModel: '',
            },
        };
    },

    methods: {
        fetchDofusWidgets: function () {
            this.widgets = [];
            DofusAPI.getWidgets().then((response) => {
                this.widgets = response.data;
            });
        },

        addDofusItem: function () {
            if (
                this.dofusItemData.nameModel.length == 0 ||
                this.dofusItemData.itemModel.length == 0
            ) {
                this.dofusItemData.missingName = true;
                return;
            }

            this.dofusItemData.isActive = false;
            this.dofusItemData.missingName = false;

            DofusAPI.addDofusItemWidget(
                this.dofusItemData.nameModel,
                this.dofusItemData.itemModel.charAt(0).toUpperCase() +
                    this.dofusItemData.itemModel.slice(1)
            ).then(() => {
                this.dofusItemData.nameModel = '';
                this.dofusItemData.itemModel = '';
                this.fetchDofusWidgets();
            });
        },

        addDofusItemSearch: function () {
            if (this.dofusItemSearchData.nameModel.length == 0) {
                this.dofusItemSearchData.missingName = true;
                return;
            }

            this.dofusItemSearchData.isActive = false;
            this.dofusItemSearchData.missingName = false;

            DofusAPI.addDofusItemSearchWidget(
                this.dofusItemSearchData.nameModel
            ).then(() => {
                this.dofusItemSearchData.nameModel = '';
                this.dofusItemSearchData.itemModel = '';
                this.fetchDofusWidgets();
            });
        },

        addDofusCraft: function () {
            if (
                this.dofusCraftData.nameModel.length == 0 ||
                this.dofusCraftData.itemModel.length == 0
            ) {
                this.dofusCraftData.missingName = true;
                return;
            }

            this.dofusCraftData.isActive = false;
            this.dofusCraftData.missingName = false;

            DofusAPI.addDofusCraftWidget(
                this.dofusCraftData.nameModel,
                this.dofusCraftData.itemModel.charAt(0).toUpperCase() +
                    this.dofusCraftData.itemModel.slice(1)
            ).then(() => {
                this.dofusCraftData.nameModel = '';
                this.dofusCraftData.itemModel = '';
                this.fetchDofusWidgets();
            });
        },

        addDofusCraftSearch: function () {
            if (this.dofusCraftDataSearch.nameModel.length == 0) {
                this.dofusCraftDataSearch.missingName = true;
                return;
            }

            this.dofusCraftDataSearch.missingName = false;
            this.dofusCraftDataSearch.isActive = false;

            DofusAPI.addDofusCraftWidgetSearch(
                this.dofusCraftDataSearch.nameModel
            ).then(() => {
                this.dofusCraftDataSearch.nameModel = '';
                this.fetchDofusWidgets();
            });
        },
    },

    mounted() {
        this.fetchDofusWidgets();
    },
};
</script>
