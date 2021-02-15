<template>
    <section>
        <div class="box">
            <article class="media">
                <div class="media-left">
                    <div>
                        <img
                            src="../../assets/images/dofusLogo.jpg"
                            style="width: 30px; height: 30px"
                        />
                    </div>
                </div>
                <div class="media-content">
                    <div class="content">
                        <div>
                            <p class="is-size-5 has-text-weight-medium">
                                Dofus Craft
                            </p>
                            <p>{{ widgetName }}</p>
                        </div>
                    </div>
                </div>

                <div class="media-right">
                    <b-dropdown aria-role="list">
                        <b-button
                            slot="trigger"
                            size="is-small"
                            type="is-text"
                            icon-left="lni-cog"
                        ></b-button>
                        <b-dropdown-item
                            aria-role="listitem"
                            @click="edit.modal = true"
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
            <div class="columns is-gapless is-flex mt-5 mb-1">
                <p class="is-size-5 has-text-weight-bold">
                    {{ itemName }}
                </p>
            </div>
            <div
                class="columns is-gapless is-flex is-align-items-center mt-3"
                v-if="isLoaded"
            >
                <div class="column is-flex is-align-items-center mr-4">
                    <img
                        :src="equipmentImageUrl"
                        style="width: 85px; height: 85px"
                        referrerpolicy="no-referrer"
                    />
                    <p class="is-size-5 has-text-weight-bold mr-6">
                        Lvl {{ itemLvl }}
                    </p>
                    <ul>
                        <li class="is-size-5 has-text-weight- ml-5 mb-3">
                            Ingrediant :
                        </li>
                        <li
                            v-for="(effect, name) in itemRecipe"
                            class="is-size-6 has-text-weight- ml-5"
                            v-bind:key="name"
                        >
                            <!-- <p v-if="effect[Object.keys(effect)[0]]['max']">
                                +{{ effect[Object.keys(effect)[0]]['min'] }} à
                                {{ effect[Object.keys(effect)[0]]['max'] }} en
                                {{ Object.keys(effect)[0] }}
                            </p> -->
                            <article>
                                <div class="media">
                                    <div class="media-right ml-0">
                                        <img
                                            :src="
                                                effect[Object.keys(effect)[0]][
                                                    'imgUrl'
                                                ]
                                            "
                                            style="width: 30px; height: 30px"
                                            referrerpolicy="no-referrer"
                                        />
                                    </div>
                                    <div class="media-left ml-4">
                                        <p>
                                            x{{
                                                effect[Object.keys(effect)[0]][
                                                    'quantity'
                                                ]
                                            }}
                                            {{ Object.keys(effect)[0] }}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div :class="['modal', edit.modal ? 'is-active' : '']">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Modify this widget</p>
                    <button
                        class="delete"
                        aria-label="close"
                        @click="edit.modal = false"
                    ></button>
                </header>
                <section class="modal-card-body">
                    <p class="mb-4">
                        <strong>Description : </strong> This widget allows you
                        to know the recipe for craft an item.
                    </p>
                    <b-field label="Name :">
                        <b-input v-model="edit.nameModel"></b-input>
                    </b-field>
                    <b-field label="Item Name :">
                        <b-input v-model="edit.itemModel">></b-input>
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
                        v-if="edit.missing"
                        type="is-danger"
                        role="alert"
                        :closable="false"
                    >
                        Please fill all the fields.
                    </b-notification>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" @click="modifyWidget">
                        Apply
                    </button>
                    <button class="button" @click="edit.modal = false">
                        Cancel
                    </button>
                </footer>
            </div>
        </div>
    </section>
</template>



<script>
import DofusAPI from '../../services/Dofus';
import axios from 'axios';

export default {
    name: 'DofusCraftWidget',

    data: function () {
        return {
            equipmentImageUrl: String,
            itemRecipe: [],
            itemLvl: String,
            isLoaded: false,
            edit: {
                modal: false,
                nameModel: this.widgetName,
                itemModel: this.itemName,
                missing: false,
            },
        };
    },

    props: {
        widgetName: String,
        widgetId: String,
        fetchWidgets: Function,
        itemName: String,
    },

    watch: {
        input: function (value) {
            this.getWeather(value);
        },
        deep: true,
    },

    created() {
        this.getItemName();
    },
    methods: {
        getItemName: async function () {
            this.isLoaded = false;
            this.equipmentImageUrl = '';
            this.itemLvl = 0;
            this.itemRecipe = [];
            await axios
                .get('https://fr.dofus.dofapi.fr/equipments/')
                .then((response) => {
                    response.data.forEach((element) => {
                        if (element.name == this.itemName) {
                            this.equipmentImageUrl = element.imgUrl;
                            this.itemLvl = element.level.toString();
                            this.itemRecipe = element.recipe;
                        }
                    });
                });
            this.isLoaded = true;
        },
        deleteWidget: function () {
            DofusAPI.deleteDofusWidget(this.widgetId).then(() => {
                this.fetchWidgets();
            });
        },

        modifyWidget: function () {
            if (
                this.edit.nameModel.length == 0 ||
                this.edit.itemModel.length == 0
            ) {
                this.edit.missing = true;
                return;
            }

            this.edit.modal = false;
            this.edit.missingName = false;

            const newParams = {
                id: this.widgetId,
                widgetName: 'dofus-craft',
                name: this.edit.nameModel,
                item:
                    this.edit.itemModel.charAt(0).toUpperCase() +
                    this.edit.itemModel.slice(1),
            };

            DofusAPI.modifyDofusWidget(newParams).then(() => {
                this.fetchWidgets();
                this.getItemName();
            });
        },
    },
};
</script>

<style>
p {
    margin: 0 !important;
}
</style>